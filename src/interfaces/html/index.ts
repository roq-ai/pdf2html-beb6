import { PdfInterface } from 'interfaces/pdf';
import { GetQueryInterface } from 'interfaces';

export interface HtmlInterface {
  id?: string;
  file_path: string;
  pdf_id?: string;
  scroll_speed?: number;
  created_at?: any;
  updated_at?: any;

  pdf?: PdfInterface;
  _count?: {};
}

export interface HtmlGetQueryInterface extends GetQueryInterface {
  id?: string;
  file_path?: string;
  pdf_id?: string;
}
