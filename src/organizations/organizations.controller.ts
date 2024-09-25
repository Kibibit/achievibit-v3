import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('orgs')
@ApiTags('Organizations')
export class OrganizationsController {}
