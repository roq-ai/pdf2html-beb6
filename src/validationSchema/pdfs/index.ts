import * as yup from 'yup';

export const pdfValidationSchema = yup.object().shape({
  file_path: yup.string().required(),
  user_id: yup.string().nullable(),
});
