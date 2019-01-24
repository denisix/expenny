import React, { PureComponent } from 'react';
import {areachart, area, xaxis, yaxis, cartesiangrid, tooltip} from 'recharts';

export default class ChartPriceLine extends PureComponent {
  constructor(props) {
  	super(props);
  }

  render() {
    if (!this.props.data) return <p>Loading..</p>;

    return(
	  <div>
		<AreaChart width={650} height={250} data={this.props.data} margin={{ top: 5, right: 0, left: 5, bottom: 5 }}>
		  <defs>
		    <linearGradient id={this.props.id} x1="0" y1="0" x2="0" y2="1">
		      <stop offset="5%" stopColor={this.props.color} stopOpacity={0.8}/>
	          <stop offset="95%" stopColor={this.props.color} stopOpacity={0}/>
		    </linearGradient>
		  </defs>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="u" />
		  <YAxis label={{ value: this.props.ytitle, angle: -90, position: 'insideLeft', textAnchor: 'middle' }} />
          <Tooltip/>
		  <Area type="monotone" dataKey="p" stroke={this.props.color} fillOpacity={1} fill={'url(#'+this.props.id+')'} dot={{ stroke: this.props.colorDark, strokeWidth: 1 }} activeDot={{ stroke: '#555', strokeWidth: 1, r: 5 }} />
        </AreaChart>
		<p className="text-center">{this.props.xtitle}</p>
	  </div>
    )     
  }
}
