import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ScreenerAPI from '../../api/ScreenerAPI';
import BacktestDataTable from '../dataTable/BacktestDataTable';
import BacktestFilter from '../backtestFilter/BacktestFilter';
import moment from 'moment';




{/*export default function Screener() {*/}
export default function Screener() {

    const [filterList, setFilterList] = React.useState([]);
    const [stockJson, setStockJson] = React.useState([]);
    const [conditions, setConditions] = React.useState([]);

    // Get filter list and set it to the state
    React.useEffect(async () => {
        const filterList = await ScreenerAPI.GetFilterList();
        /**
         * date:04222022
         * change:add code
         * function: sort by alphabet
         * author:JHCHI
         * lines: this line + 5 lines
         */
        filterList.sort((a, b) => (a.filter_name > b.filter_name) ? 1 : ((b.filter_name > a.filter_name) ? -1 : 0))
        for (var i = 0; i < filterList.length; i++) {
            filterList[i]['id'] = i;
        }
        setFilterList(filterList);
    }, [])

    // Condition update callback for child component
    const handleConditionChange = (itemIndex, updatedCond) => {
        let newCond = [...conditions];
        newCond[itemIndex] = updatedCond;
        setConditions(newCond);
    }

    // Add new filter
    const addItem = (isDate, isAdvanced) => {
        // Limit dateItem to 1
        if (isDate) {
          for (var i = 0; i < conditions.length; i++) {
            if (conditions[i].isDate) return;
          } 
        }
        let newCondition = [...conditions];
        newCondition.push({
            filterIdx: 0,
            formula: "",
            comparison: "",
            value1: 0,
            value2: 0,
            isAdvanced: isAdvanced,
            isDate: isDate,
            error: false,
            id: uuidv4(),
        });
        setConditions(newCondition);
    };

    // Remove filter by id
    const removeItem = (id) => {
        let newConditions = [...conditions];
        const newCond = newConditions.filter(newCondition => newCondition.id != id);
        setConditions(newCond);
        console.log(newCond);
    }

    // Send out the search to backend API
    const search = async () => {
        // POST request
        console.log(conditions);
        let data = [];
        let dateIn = "2021-07-13", dateOut = "2022-01-19";
        let dateIdx = -1;
        for (var i = 0; i < conditions.length; i++) {
            // If this is the advance filter
            if (conditions[i]['isAdvanced'] == true) {
                data.push(conditions[i]['formula']);
            } else if (conditions[i]['isDate'] == false){
                data.push(filterList[conditions[i]['filterIdx']]['filter_name']);
            }
            if (conditions[i]['comparison'] === 10) {
                // If comparison is greater than
                data.push('>');
                data.push(conditions[i]['value1']);
            } else if (conditions[i]['comparison'] === 20) {
                // If comparison is less than
                data.push('<');
                data.push(conditions[i]['value1']);
            } else if (conditions[i]['comparison'] === 30) {
                // If comparison is equal to
                data.push('=');
                data.push(conditions[i]['value1']);
            } else {
                // If comparison is between 
                if (conditions[i].isDate) {
                  dateIn = conditions[i]['value1'];
                  dateOut = conditions[i]['value2'];
                  dateIdx = i;
                } else {
                  data.push('BETWEEN');
                  data.push(conditions[i]['value1']);
                  data.push(conditions[i]['value2']);
                }
            }
            {/* data.push(conditions[i]['date1']);*/}
        }
        console.log(data, dateIn, dateOut);
        if(!moment(dateIn, 'YYYY-MM-DD', true).isValid() || !moment(dateOut, 'YYYY-MM-DD', true).isValid()) {
          console.log("error");
          let newConditions = [...conditions];
          newConditions[dateIdx]['error'] = true; 
          newConditions[dateIdx]['error'] = true; 
          setConditions(newConditions);
          return;
        } else {
          let newConditions = [...conditions];
          if (dateIdx > -1) {
            newConditions[dateIdx]['error'] = false; 
            newConditions[dateIdx]['error'] = false; 
          }
          setConditions(newConditions);
        }
        //const res = 1;
        const res = await ScreenerAPI.BacktestFilter(data, dateIn, dateOut);
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            res[i]['id'] = i;
        }
        setStockJson(res);
    }


    return (
        <>
            <Box
                sx={{
                    my: 5,
                }}
            >
                <Card variant="contained" style={{ backgroundColor: "#ededed" }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom style={{ marginBottom: 12 }}>
                            Find stocks that...
                        </Typography>
                        <div>
                            <Stack spacing={2}>
                                {conditions.map((condition, index) =>
                                    <BacktestFilter
                                        key={condition.id}
                                        filterList={filterList}
                                        itemIndex={index}
                                        conditionItem={condition}
                                        handleConditionChange={handleConditionChange}
                                        removeItem={removeItem}
                                    />)}
                            </Stack>
                        </div>
                    </CardContent>
                    <CardActions>
                        <Grid
                            container
                            sx={{ p: 1 }}
                            justifyContent="space-between"
                        >
                            <Grid
                                container
                                item
                                xs={6}
                                sm={8}
                                sx={{ flexGrow: 1 }}
                                spacing={2}
                                alignItems="center"
                            >
                                <Grid
                                    item
                                >
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        style={{ backgroundColor: "#707070" }}
                                        onClick={() => addItem(false)}
                                    >
                                        + Basic
                                    </Button>
                                </Grid>
                                <Grid
                                    item
                                >
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        style={{ backgroundColor: "#707070" }}
                                        onClick={() => addItem(true, false)}
                                    >
                                        + Date
                                    </Button>
                                </Grid>
                                <Grid
                                    item
                                >
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        style={{ backgroundColor: "#707070" }}
                                        onClick={() => addItem(false, true)}
                                    >
                                        + ADVANCED
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                item
                                xs={6}
                                sm={4}
                                sx={{
                                    alignItems: {
                                        xs: "flex-end",
                                        sm: "center"
                                    }
                                }}
                                justifyContent="flex-end"
                            >
                                <Button
                                    variant='contained'
                                    color='secondary'
                                    style={{ backgroundColor: "#707070" }}
                                    onClick={search}
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </Box>
            <Box
                sx={{
                    my: 5,
                }}
            >
                <BacktestDataTable stock_json={stockJson} />
            </Box>
        </>
    );
}
