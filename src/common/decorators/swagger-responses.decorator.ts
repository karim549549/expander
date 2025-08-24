import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { StandardResponse } from '../responses/standard-response';
import { PaginationResponse } from '../responses/pagination-response';

export function ApiAuthOperation(summary: string, dto: any, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: dto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid credentials.',
    }),
  );
}

export function ApiRegisterOperation(summary: string, dto: any, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: dto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'User with this email already exists.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input.',
    }),
  );
}

export function ApiCreateClientOperation(summary: string, dto: any, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: dto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: successMessage,
      type: StandardResponse,
    }),
  );
}

export function ApiFindAllClientsOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
  );
}

export function ApiFindOneClientOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Client not found',
    }),
  );
}

export function ApiUpdateClientOperation(summary: string, dto: any, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: dto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Client not found',
    }),
  );
}

export function ApiRemoveClientOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: successMessage,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Client not found',
    }),
  );
}

export function ApiCreateVendorOperation(summary: string, dto: any, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: dto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: successMessage,
      type: StandardResponse,
    }),
  );
}

export function ApiFindAllVendorsOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
  );
}

export function ApiFindOneVendorOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vendor not found',
    }),
  );
}

export function ApiUpdateVendorOperation(summary: string, dto: any, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: dto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vendor not found',
    }),
  );
}

export function ApiRemoveVendorOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: successMessage,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vendor not found',
    }),
  );
}

export function ApiCreateProjectOperation(summary: string, dto: any, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: dto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: successMessage,
      type: StandardResponse,
    }),
  );
}

export function ApiFindAllProjectsOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
  );
}

export function ApiFindOneProjectOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Project not found',
    }),
  );
}

export function ApiUpdateProjectOperation(summary: string, dto: any, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: dto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Project not found',
    }),
  );
}

export function ApiRemoveProjectOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: successMessage,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Project not found',
    }),
  );
}

export function ApiCreateDocumentOperation(summary: string, dto: any, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: dto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: successMessage,
      type: StandardResponse,
    }),
  );
}

export function ApiFindAllDocumentsOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
  );
}

export function ApiFindDocumentByProjectOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Documents for project not found',
    }),
  );
}

export function ApiFindDocumentByTagOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Documents with tag not found',
    }),
  );
}

export function ApiFindDocumentByTextOperation(summary: string, successMessage: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: successMessage,
      type: StandardResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Documents matching text not found',
    }),
  );
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginationResponse, model),
    ApiResponse({
      status: HttpStatus.OK,
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandardResponse) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PaginationResponse) },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};
