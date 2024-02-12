import { ExtensionProperties } from 'otamashelf/ExtensionProperties';
import { Json } from 'otamashelf/Json';

export type JsonRpcRequest = {
  jsonrpc: '2.0';
  method: string;
  params?: Json;
  id?: string | number | null;
};

export type JsonRpcResponseSuccess = {
  jsonrpc: '2.0';
  result: Json;
  id: string | number | null;
};

export type JsonRpcResponseError = {
  jsonrpc: '2.0';
  error: Json;
  id: string | number | null;
};

export type JsonRpcResponse = JsonRpcResponseSuccess | JsonRpcResponseError;

export type RegisterExtension = JsonRpcRequest & {
  method: 'register-extension';
  params: ExtensionProperties[];
};

export type Response = JsonRpcResponse;

export type Request = JsonRpcRequest;
