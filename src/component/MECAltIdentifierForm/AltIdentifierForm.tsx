import React, { useState } from 'react';
import { Box } from '@mui/material';
import { AltIdentifierType, FormType } from 'utils/types';
import { TextValidator } from 'react-material-ui-form-validator';

interface Props extends  FormType {
    data:AltIdentifierType
}

export default function({ data, parentKey }:Props){

  const [formData, setFormData] = useState<AltIdentifierType>(data);

  return (
    <Box sx = {{ m:1 }}>
      <TextValidator
        name={`${parentKey}.Namespace`} 
        label="Namespace *" 
        validators={['required']}
        errorMessages={['this field is required']} />
      <br/>
      <TextValidator
        name={`${parentKey}.Identifier`} 
        label="Identifier *" 
        validators={['required']}
        errorMessages={['this field is required']} />
    </Box>
  )
}