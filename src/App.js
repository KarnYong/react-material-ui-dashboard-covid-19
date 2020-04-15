import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  title: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 2,
  },
});

class App extends React.Component {
  //classes = useStyles;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataTimeline: [],
      dataTimeline15: [],
      dataTimeline20: [],
      data_text: {
        updatedDate: "",
        confirmed: "",
        hospitalized: "",
        deaths: "",
        recovered: "",
        newConfirmed: "",
        newHospitalized: "",
        newDeaths: "",
        newRecovered: "",
      },
      data_pie: [{}],
    };
  }

  componentDidMount() {
    this.setState({
      isLoading : false,
    });
    this.callAPI();
  }

  callAPI() {
    this.setState({ isLoading: true });
    axios.get("https://covid19.th-stat.com/api/open/timeline")
    .then(response => {
        console.log(response.data);
        const data = response.data["Data"];
        const lastData = data.slice(-1)[0];
        this.setState({
          dataTimeline: data,
          dataTimeline15: data.slice(1).slice(-15),
          dataTimeline20: data.slice(1).slice(-20),
          data_text: {
            source: response.data["Source"],
            updatedDate: lastData["Date"],
            confirmed: lastData["Confirmed"],
            hospitalized: lastData["Hospitalized"],
            deaths: lastData["Deaths"],
            recovered: lastData["Recovered"],
            newConfirmed: lastData["NewConfirmed"],
            newHospitalized: lastData["NewHospitalized"],
            newDeaths: lastData["NewDeaths"],
            newRecovered: lastData["NewRecovered"],
          },
          data_pie: [
            { name: "hospitalized", value: lastData["Hospitalized"] },
            { name: "deaths", value: lastData["Deaths"] },
            { name: "recovered", value: lastData["Recovered"] },
          ]
        });
        
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(() => {
        this.setState({ isLoading: false });
    });
  }

  render() {
    const { classes } = this.props;
    console.log(classes);
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Simple Thailand COVID-19 Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.appBarSpacer} />
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography align="right">
                Last updated: {this.state.data_text.updatedDate}
              </Typography>
              <Typography variant="subtitle2" align="right">
                <a href={this.state.data_text.source} target="_blank" rel="noopener noreferrer">{this.state.data_text.source}</a>
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={classes.paper}>
                <Typography>Confirmed</Typography>
                <Typography variant="h3">{this.state.data_text.confirmed.toLocaleString()}</Typography>
                <Typography variant="h5">({this.state.data_text.newConfirmed.toLocaleString()})</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={classes.paper}>
                <Typography>Hospitalized</Typography>
                <Typography variant="h3">{this.state.data_text.hospitalized.toLocaleString()}</Typography>
                <Typography variant="h5">({this.state.data_text.newHospitalized.toLocaleString()})</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={classes.paper}>
                <Typography>Deaths</Typography>
                <Typography variant="h3">{this.state.data_text.deaths.toLocaleString()}</Typography>
                <Typography variant="h5">({this.state.data_text.newDeaths.toLocaleString()})</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={classes.paper}>
                <Typography>Recovered</Typography>
                <Typography variant="h3">{this.state.data_text.recovered.toLocaleString()}</Typography>
                <Typography variant="h5">({this.state.data_text.newRecovered.toLocaleString()})</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                    width={500} 
                    height={300} 
                    data={this.state.dataTimeline15}
                    margin={{top: 5, right: 5, left: 0, bottom: 5}}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="NewConfirmed" fill="#8884d8" />
                    <Bar dataKey="NewDeaths" fill="#FF9AA2" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart width={400} height={400}>
                    <Legend />
                    <Pie dataKey="value" isAnimationActive={false} data={this.state.data_pie} outerRadius={100} label>
                      <Cell fill="#8884d8" />
                      <Cell fill="#FF9AA2" />
                      <Cell fill="#8FC1A9" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart
                    data={this.state.dataTimeline}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Confirmed" stroke="blue" dot={false} />
                    <Line type="monotone" dataKey="Hospitalized" stroke="orange" dot={false} />
                    <Line type="monotone" dataKey="Deaths" stroke="red" dot={false} />
                    <Line type="monotone" dataKey="Recovered" stroke="green" dot={false} />
                  </LineChart>  
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <footer className={classes.footer}>
          <Paper className={classes.paper}>
            <Typography variant="h6">
              React App with Material UI for simple Thailand Covid-19 Dashboard
            </Typography>
            <Typography component="p">
              Source code by KarnYong @ <a href="https://github.com/KarnYong/react-material-ui-dashboard-covid-19">https://github.com/KarnYong/react-material-ui-dashboard-covid-19</a>
            </Typography>
          </Paper>
        </footer>
      </div>
    );
  }
}

export default withStyles(styles)(App);