import { Controller } from '@nestjs/common';
import { MylogService } from './mylog.service';

@Controller('mylog')
export class MylogController {
  constructor(private readonly mylogService: MylogService) {}
}
