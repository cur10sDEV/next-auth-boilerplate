export type successResponse = {
  success: true;
  message?: string;
  data?: any;
  twoFactor?: boolean;
};

export type errorResponse = {
  success: false;
  message: string | "500 Internal Server Error";
  data?: any;
};

export type actionResponse = successResponse | errorResponse;

export interface IChildrenProps {
  children: React.ReactNode;
}
