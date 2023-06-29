import { HtmlInterface } from 'interfaces/html';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PdfInterface {
  id?: string;
  file_path: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  html?: HtmlInterface[];
  user?: UserInterface;
  _count?: {
    html?: number;
  };
}

export interface PdfGetQueryInterface extends GetQueryInterface {
  id?: string;
  file_path?: string;
  user_id?: string;
}
