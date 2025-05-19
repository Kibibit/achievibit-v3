
import { NextFunction, Request, Response } from 'express';
import { readJSONSync } from 'fs-extra';

interface ISwaggerCoverageOptions {
  docsPath: string;
  enable?: boolean;
}

interface ICoverageEntry {
  responses: Set<number>;
  callCount: number;
  regex: RegExp;
}

let coverageMap: Record<string, Record<string, ICoverageEntry>> = {};
let swaggerDoc: any;
let initialized = false;

function initialize(docsPath: string) {
  swaggerDoc = readJSONSync(docsPath);
  coverageMap = {};

  for (const path in swaggerDoc.paths) {
    coverageMap[path] = {};
    for (const method in swaggerDoc.paths[path]) {
      const regex = new RegExp(
        '^' +
        path
          .replace(/\/+$/, '')                          // remove trailing slash
          .replace(/{[^/}]+}/g, '[^/]+') +              // replace path params
        '/?$'                                           // allow optional trailing slash
      );
      coverageMap[path][method] = {
        responses: new Set(),
        callCount: 0,
        regex
      };
    }
  }

  initialized = true;
}

export function swaggerCoverageMiddleware(options: ISwaggerCoverageOptions) {
  const enabled = options.enable ?? process.env.NODE_ENV === 'test';
  if (!enabled) return (_req: Request, _res: Response, next: NextFunction) => next();

  if (!initialized) {
    initialize(options.docsPath);
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const method = req.method.toLowerCase();
    const urlPath = req.path.replace(/\/+$/, '');
  
    const originalEnd = res.end;
    res.end = function patchedEnd(...args: any[]) {
      for (const swaggerPath in coverageMap) {
        const entry = coverageMap[swaggerPath][method];
        if (entry?.regex.test(urlPath)) {
          entry.responses.add(res.statusCode);
          entry.callCount++;
          break;
        }
      }
  
      return originalEnd.apply(this, args);
    };
  
    next();
  };
}

export function getSwaggerCoverageReport() {
  if (!swaggerDoc) throw new Error('Swagger doc not loaded. Call swaggerCoverageMiddleware first.');

  const report: any = {
    paths: {},
    coverage: 0,
    total: 0,
    tested: 0,
    undocumentedResponses: []
  };

  for (const path in swaggerDoc.paths) {
    report.paths[path] = {};
    for (const method in swaggerDoc.paths[path]) {
      const definedResponses = Object.keys(swaggerDoc.paths[path][method].responses || []);
      const entry = coverageMap[path]?.[method];

      const seenResponses = Array.from(entry?.responses || []);
      const matchedResponses = seenResponses.filter((status) => definedResponses.includes(String(status)));
      const unexpectedResponses = seenResponses.filter((status) => !definedResponses.includes(String(status)));

      if (unexpectedResponses.length > 0) {
        report.undocumentedResponses.push({ path, method, unexpectedResponses });
      }

      const status =
        matchedResponses.length === 0 ?
          'none' :
          matchedResponses.length === definedResponses.length ?
            'full' :
            'partial';

      const percentage =
        definedResponses.length > 0 ?
          Math.round((matchedResponses.length / definedResponses.length) * 100) :
          100;

      report.paths[path][method] = {
        tested: matchedResponses.length > 0,
        status,
        seenResponses,
        expectedResponses: definedResponses,
        unexpectedResponses,
        percentage,
        callCount: entry?.callCount ?? 0
      };

      report.total++;
      if (matchedResponses.length > 0) report.tested++;
    }
  }

  report.coverage = report.total > 0 ? (report.tested / report.total) * 100 : 100;
  return report;
}
