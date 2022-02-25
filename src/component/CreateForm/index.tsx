import * as React from 'react';
import { Button, Grid, Typography,Box,  Link } from '@mui/material';

import MMCForm from './MMCForm';
import MECForm from './MECForm';
import { Divider } from '@mui/material';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useParams } from 'react-router-dom';
import CustomTextValidator from 'component/CustomTextValidator';
// import { mec, mmc } from 'utils/demo';
import { createNewMovie, getMovieDetail, updateMovie } from 'api'
import _ from 'lodash';

import MECContext from 'context/MECContext';
import MMCContext from 'context/MMCContext';
import moment from 'moment';

export default function CreateForm() {

  const { id } = useParams();

  const formRef = React.useRef<any>();
  const MMCFormRef = React.useRef<any>();
  const MECFormRef = React.useRef<any>();
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [movieData, setMovieData] = React.useState<any>({ title:'' });

  const [mecJSON, setMECJSON] = React.useState<any>({
    ReleaseDate:moment().format('yyyy-MM-DD'),
    ReleaseYear:moment().format('yyyy'),
    ReleaseHistory: {
      Date:moment().format('yyyy-MM-DD')
    }
  });

  console.log('mecJSON ===>', mecJSON);

  const mecCxtValue = React.useMemo(() => ({ mecJSON, setMECJSON }), [mecJSON, movieData]);

  const [mmcJSON, setMMCJSON] = React.useState<any>({});
  const mmcCxtValue = React.useMemo(() => ({ mmcJSON, setMMCJSON }), [mmcJSON, movieData]);

  React.useEffect(()=>{
    if(id){
      getMovieDetail(id).then((res:any)=>{
        setMovieData(res.data);
        setMECJSON(res.data.mec);
        setMMCJSON(res.data.mmc);
      }).catch((err)=>console.log);
    }
  }, [id]);

  const onSubmit = () => {

    const payload = { title:movieData.title, mec:mecJSON, mmc:mmcJSON };

    if(payload.title && payload.mmc && payload.mec){
      if(movieData.id){
        updateMovie(movieData.id, payload).then((res:any)=>{
          setIsRequesting(false);
        }).catch(err=>{
          setIsRequesting(false);
          console.log(err);
        });
      }else{
        createNewMovie(payload).then((res:any)=>{
          location.href = '/';
          setIsRequesting(false);
        }).catch(err=>{
          setIsRequesting(false);
          console.log(err);
        });
      }

    }
  }

  return (
    <Box sx = {{ pt:'20px' }}>
      <Box sx = {{ mb:'8px', display:'flex' }}>
        <Link href='/' underline="none">
          <Button  variant='outlined'>Back</Button>
        </Link>
      </Box>
      <ValidatorForm
        ref = {formRef}
        autoComplete="off"
        onSubmit = {onSubmit}
      >
        <Box>
          <Box sx = {{ mb:'20px', mt:'20px' }}>
            <Typography variant='h5'>{(id)?'Update':'New Movie'}</Typography>
            <br/>
            <CustomTextValidator
              value = {movieData.title}
              validators={['required']} 
              errorMessages={['this field is required']}
              onBlur = {(e:any)=>{
                setMovieData({ ...movieData, title:e.target.value });
                const contentID = `md:cid:org:amzn_studios:${e.target.value}`;
                _.set(mecJSON, 'BasicMetadata-type.@ContentID', contentID);
                setMECJSON({ ...mecJSON });
              }}
              name="title" 
              label="Movie Title *" />
          
          </Box>
          <Divider />
          <Box sx={{ width: '100%', mt:'20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MECContext.Provider value={mecCxtValue}>
                  <MECForm movieTitle = {movieData.title} />
                </MECContext.Provider>
              </Grid>
              <Grid item xs={12}>
                <Divider />
                <MMCContext.Provider value={mmcCxtValue}>
                  <MMCForm />
                </MMCContext.Provider>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box>
          <Button type='submit' variant="outlined" disabled = {isRequesting}>Submit</Button>
        </Box>
      </ValidatorForm>
    </Box>
  );
}
