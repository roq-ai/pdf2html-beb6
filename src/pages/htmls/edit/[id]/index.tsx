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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getHtmlById, updateHtmlById } from 'apiSdk/htmls';
import { Error } from 'components/error';
import { htmlValidationSchema } from 'validationSchema/htmls';
import { HtmlInterface } from 'interfaces/html';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { PdfInterface } from 'interfaces/pdf';
import { getPdfs } from 'apiSdk/pdfs';

function HtmlEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<HtmlInterface>(
    () => (id ? `/htmls/${id}` : null),
    () => getHtmlById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: HtmlInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateHtmlById(id, values);
      mutate(updated);
      resetForm();
      router.push('/htmls');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<HtmlInterface>({
    initialValues: data,
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
            Edit Html
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(HtmlEditPage);
