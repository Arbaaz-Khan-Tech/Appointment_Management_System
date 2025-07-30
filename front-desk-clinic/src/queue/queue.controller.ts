import { Controller, Post, Get, Body, Param, Patch, Delete , Query} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  create(@Body() dto: CreateQueueDto) {
    return this.queueService.create(dto);
  }

  @Get()
findAll(@Query('status') status?: 'waiting' | 'with_doctor' | 'completed') {
  return this.queueService.findAll(status);
}


  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQueueDto) {
    return this.queueService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueService.remove(+id);
  }
}
