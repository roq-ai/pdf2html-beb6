import axios from 'axios';
import queryString from 'query-string';
import { PdfInterface, PdfGetQueryInterface } from 'interfaces/pdf';
import { GetQueryInterface } from '../../interfaces';

export const getPdfs = async (query?: PdfGetQueryInterface) => {
  const response = await axios.get(`/api/pdfs${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPdf = async (pdf: PdfInterface) => {
  const response = await axios.post('/api/pdfs', pdf);
  return response.data;
};

export const updatePdfById = async (id: string, pdf: PdfInterface) => {
  const response = await axios.put(`/api/pdfs/${id}`, pdf);
  return response.data;
};

export const getPdfById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/pdfs/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePdfById = async (id: string) => {
  const response = await axios.delete(`/api/pdfs/${id}`);
  return response.data;
};
