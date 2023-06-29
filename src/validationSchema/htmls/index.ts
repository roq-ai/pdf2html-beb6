import * as yup from 'yup';

export const htmlValidationSchema = yup.object().shape({
  file_path: yup.string().required(),
  scroll_speed: yup.number().integer(),
  pdf_id: yup.string().nullable(),
});
