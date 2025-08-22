import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class StandardResponse<T> {
  @ApiProperty({ example: HttpStatus.OK, description: 'HTTP status code' })
  statusCode: HttpStatus;

  @ApiProperty({
    example: 'Operation successful',
    description: 'A message describing the outcome of the operation',
  })
  message: string;

  @ApiProperty({ description: 'The actual data payload of the response' })
  data: T;

  constructor(
    data: T,
    message: string = 'Operation successful',
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
