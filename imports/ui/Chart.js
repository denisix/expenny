import React, { Component } from 'react';

import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { GradientPinkBlue } from '@vx/gradient';
//import { letterFrequency, browserUsage } from '@vx/mock-data';

import { withTracker } from 'meteor/react-meteor-data';

import { Expenses, Cats } from '../api/db.js';

import Expense from './Expense.js';

function Label({ x, y, v, children }) {
  return (
    <text
      fill="white"
      textAnchor="middle"
      x={x}
      y={y}
      dy=".33em"
      fontSize={10}
    >
		<tspan x={x} dy="0">{children}</tspan>
		<tspan x={x} dy="11" fontSize={9}>{v}</tspan>
    </text>
  );
}

class Chart extends Component {
  getSign() {
  	const user = this.props.currentUser;
    if (user && typeof user === "object" && "profile" in user && typeof user.profile === "object" && "sign" in user.profile) {
        return user.profile.sign;
    }
    return '$';
  }

  getSignOrder(lr) {
	const user = this.props.currentUser;
    if (user && typeof user === "object" && "profile" in user && typeof user.profile === "object" && "signOrder" in user.profile) {
		return (lr == 'l') ? !user.profile.signOrder : user.profile.signOrder;
    }
    return lr == 'l' ? true : false;
  }

  getCategoryById(catId) {
	const c = this.props.cats.filter(function(v){ return v._id == catId});
	if (c && typeof c === "object" && 0 in c) {
		//console.log(' category '+ catId +' => '+c[0].title);
		return c[0].title;
	}
	return '-';
  }

  getExpCount() {
	return this.props.expenses.length;
  }

  getExpSum() {
    var sum = 0;
	this.props.expenses.forEach((e) => {
		sum += e.price;
	});
	return Math.round(sum*100)/100;
  }

  getChartData() {
  	var data = []
	var sums = {};

	this.props.expenses.forEach((e) => {
		var f = parseFloat(e.price);
		if (!isNaN(f)) {
			if (isNaN(sums[e.catId])) {
				sums[e.catId] = f;
			} else {
				sums[e.catId] += f;
			}
		}
		// console.log(' catId=' + catId +' sum='+sums[catId]);
	});

    if (typeof sums === "object") {
        for (var catId in sums) {
            console.log(' catId=' + catId +' sum='+sums[catId]);
            data.push({
                x: this.getCategoryById(catId),
                v: this.getSignOrder('l') ? (this.getSign() +' '+ sums[catId]) : (sums[catId] +' '+this.getSign()),
                y: sums[catId],
            });
        }
    }
	
	return data;
  }

  render() {

	const width = 600;
	const height = 700;
	const margin = { top: 10, left: 10 };

	const radius = Math.min(width, height) / 2;
	const chartData = this.getChartData();

    return (
      <div className="container">
        {Meteor.userId() != null ? (
            <div>
                <header>
                    <div className="account-div"><a href="/">Back</a></div>
                    <b>Expense List &nbsp;-&gt;&nbsp; Chart</b>
                </header>

				<svg width={width} height={height}>

					<GradientPinkBlue id="gradients" />
					<rect
					x={0}
					y={0}
					rx={14}
					width={width}
					height={height}
					fill="url('#gradients')" />

					<Group top={height / 2 - margin.top} left={width / 2}>
						<Pie
						  data={chartData}
						  pieValue={d => d.y}
						  outerRadius={radius - 80}
						  innerRadius={radius - 110}
						  fill="white"
						  fillOpacity={d => 1 / (d.index + 1) }
						  cornerRadius={3}
						  padAngle={0}
						  centroid={(centroid, arc) => {
							const [x, y] = centroid;
							const { startAngle, endAngle } = arc;
							if (endAngle - startAngle < .1) return null;
							return <Label x={x} y={y} v={arc.data.v}>{arc.data.x}</Label>;
						  }}
						/>

						
						<Pie
						  data={chartData}
						  pieValue={d => d.y}
						  outerRadius={radius - 135}
						  fill="black"
						  fillOpacity={d => 1 / (d.index + 2) }
						  centroid={(centroid, arc) => {
							const [x, y] = centroid;
							return <Label x={x} y={y} v={arc.data.v}>{arc.data.x}</Label>;
						  }}
						/>
					</Group>

				</svg>
            </div>
    	) : (
            <div>
                <header>
                    <b>Expense List &nbsp;-&gt;&nbsp; Chart</b>
                    <div className="account-div"><a href="/">Back</a></div>
                </header>
                <br/>
                <center><b>Not authorized.</b></center>
                <br/>
            </div>
        )}
      </div>
	);
  }
}

export default withTracker(() => {
	Meteor.subscribe('exps');
	Meteor.subscribe('cats');
	return {
		expenses: Expenses.find({}, { sort: { createdAt: -1 } }).fetch(),
		cats: Cats.find({}).fetch(),
		currentUser: Meteor.user(),
	};
})(Chart);
