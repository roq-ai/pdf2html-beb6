import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createHtml } from 'apiSdk/htmls';
import { Error } from 'components/error';
import { htmlValidationSchema } from 'validationSchema/htmls';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { PdfInterface } from 'interfaces/pdf';
import { getPdfs } from 'apiSdk/pdfs';
import { HtmlInterface } from 'interfaces/html';

function HtmlCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: HtmlInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createHtml(values);
      resetForm();
      router.push('/htmls');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HtmlInterface>({
    initialValues: {
      file_path: '',
      scroll_speed: 0,
      pdf_id: (router.query.pdf_id as string) ?? null,
    },
    validationSchema: htmlValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Html
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="file_path" mb="4" isInvalid={!!formik.errors?.file_path}>
            <FormLabel>File Path</FormLabel>
            <Input type="text" name="file_path" value={formik.values?.file_path} onChange={formik.handleChange} />
            {formik.errors.file_path && <FormErrorMessage>{formik.errors?.file_path}</FormErrorMessage>}
          </FormControl>
          <FormControl id="scroll_speed" mb="4" isInvalid={!!formik.errors?.scroll_speed}>
            <FormLabel>Scroll Speed</FormLabel>
            <NumberInput
              name="scroll_speed"
              value={formik.values?.scroll_speed}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('scroll_speed', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.scroll_speed && <FormErrorMessage>{formik.errors?.scroll_speed}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<PdfInterface>
            formik={formik}
            name={'pdf_id'}
            label={'Select Pdf'}
            placeholder={'Select Pdf'}
            fetcher={getPdfs}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.file_path}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'html',
    operation: AccessOperationEnum.CREATE,
  }),
)(HtmlCreatePage);
