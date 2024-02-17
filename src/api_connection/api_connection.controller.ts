import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiConnectionService } from './api_connection.service';
import { LinkGenDTO, transactionsDTO } from './dto/linkInfo.dto';

@Controller('api-connection')
export class ApiConnectionController {
  constructor(private readonly apiConnectionService: ApiConnectionService) {}
  @Get('/institutions')
  async getInstitutions(): Promise<any> {
    const info = await this.apiConnectionService.getAllLinks();
    console.log(info);
    return info;
  }

  //La ruta post ésta, está mal.
  @Post('/genLink')
  async generateLink(@Body() linkGen: LinkGenDTO): Promise<any> {
    const linkInfo = await this.apiConnectionService.generateLink(
      linkGen.institution,
      linkGen.username,
      linkGen.password,
    );
    return linkInfo;
  }

  @Post('/getTransactions')
  async getTrasnactions(@Body() data: transactionsDTO) {
    try {
      const info = await this.apiConnectionService.getTransactions(
        data.institution,
        data.username,
        data.password,
        data.date_from,
        data.date_to,
      );
      console.log(info);
      return info;
    } catch (error) {
      throw new Error(error);
    }
  }
}
