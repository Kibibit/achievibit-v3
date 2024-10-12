import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PageModel } from '@kb-models';

export const ApiOkResponsePaginated = <DataModel extends Type<unknown>>(
  dataModel: DataModel,
  description?: string
) =>
    applyDecorators(
      ApiExtraModels(PageModel, dataModel),
      ApiOkResponse({
        description: description || `A paginated list of type ${ dataModel.name }`,
        schema: {
          allOf: [
            { $ref: getSchemaPath(PageModel) },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(dataModel) }
                }
              }
            }
          ]
        }
      })
    );
