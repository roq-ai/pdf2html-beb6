import axios from 'axios';
import queryString from 'query-string';
import { HtmlInterface, HtmlGetQueryInterface } from 'interfaces/html';
import { GetQueryInterface } from '../../interfaces';

export const getHtmls = async (query?: HtmlGetQueryInterface) => {
  const response = await axios.get(`/api/htmls${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHtml = async (html: HtmlInterface) => {
  const response = await axios.post('/api/htmls', html);
  return response.data;
};

export const updateHtmlById = async (id: string, html: HtmlInterface) => {
  const response = await axios.put(`/api/htmls/${id}`, html);
  return response.data;
};

export const getHtmlById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/htmls/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteHtmlById = async (id: string) => {
  const response = await axios.delete(`/api/htmls/${id}`);
  return response.data;
};
