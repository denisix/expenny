import React, { PureComponent } from 'react'
import {BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'

export default class Page_Stats extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            data: this.genData(props),
            width: parseInt(window.innerWidth  * 0.9),
        }
    }

    componentDidUpdate(p) {
        if (p.expenses != this.props.expenses ||
            p.revenues != this.props.revenues ||
			p.loans != this.props.loans) {
	            this.setState({ data: this.genData(this.props) })
        }
    }

    genHex() {
        let h = parseInt(Math.random()*255+0.5).toString(16)
        if (h.length < 2) h = '0'+h
        return h
    }

    genColor() {
        return '#'+this.genHex() + this.genHex() + this.genHex();
    }

    genData(p) {

        const exp = p.expenses.map(i => {
            return {
                title: i.title.substr(0,5),
                t: i.createdAt.getTime(),
                uv: 0,
                pv: parseInt(i.price*100)/100,
            }
        })

        const rev = p.revenues.map(i => {
            return {
                title: i.title.substr(0,5),
                t: i.createdAt.getTime(),
                uv: parseInt(i.price*100)/100,
                pv: 0,
            }
        })

        const bar = exp.concat(rev).sort((a,b) => a.t-b.t)

        // Pie EXP
        let pie_exp_data = {}
        p.expenses.forEach(i => {
            if (!pie_exp_data[i.catId]) pie_exp_data[i.catId] = 0
            pie_exp_data[i.catId] += i.price
        })

        let cats_exp_hash = {}
        p.cats_exp.forEach(i => cats_exp_hash[i._id] = i.title)

        let pie_exp_colors = []
        const pie_exp = Object.keys(pie_exp_data).map(i => {
            pie_exp_colors.push(this.genColor())
            return { 
                title: cats_exp_hash[i], 
                uv: pie_exp_data[i]
            } 
        })

        // Pie Rev
        let pie_rev_data = {}
        p.revenues.forEach(i => {
            if (!pie_rev_data[i.catId]) pie_rev_data[i.catId] = 0
            pie_rev_data[i.catId] += i.price
        })

        let cats_rev_hash = {}
        p.cats_rev.forEach(i => cats_rev_hash[i._id] = i.title)

        let pie_rev_colors = []
        const pie_rev = Object.keys(pie_rev_data).map(i => {
            pie_rev_colors.push(this.genColor())
            return { 
                title: cats_rev_hash[i], 
                uv: pie_rev_data[i]
            } 
        })

        // Pie Loans
        let pie_loa_data = {}
		p.loans.forEach(i => pie_loa_data[i.title] = i.amount)

        let pie_loa_colors = []
        const pie_loa = Object.keys(pie_loa_data).map(i => {
            pie_loa_colors.push(this.genColor())
            return { 
                title: i,
                uv: pie_loa_data[i]
            }
        })

        return {
            bar,
            pie_exp,
            pie_exp_colors,
            pie_rev,
            pie_rev_colors,
            pie_loa,
            pie_loa_colors,
        }
    }

    render() {
        if (Meteor.userId() == null) return <p>Not autorized!</p>

            const margin = { top: 5, right: 0, left: 5, bottom: 5 }
            const colors = [ "#12ca9d", "#42ea9d", "#12cafd", "#32ca0d", "#322aad", "#92faad", "#929a9d" ]

        //console.log(this.state.data);

        return (
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center">
                    <div className="col-12">

                        <p className="text-center">Expenses / Revenues</p>

                        <BarChart width={this.state.width} height={300} data={this.state.data.bar}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="pv" fill="#8884d8" name="Expense" />
                            <Bar dataKey="uv" fill="#82ca9d" name="Revenue" />
                        </BarChart>
                    </div>


                    <div className="col-12 mt-5">

                        <p className="text-center">Expenses</p>

                        <PieChart width={this.state.width} height={250}>
                          <Pie data={this.state.data.pie_exp} nameKey="title" dataKey="uv" cx="50%" cy="50%" outerRadius={80} label>
                            {this.state.data.pie_exp.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={this.state.data.pie_exp_colors[index]} />
                            ))}
                          </Pie>
                          <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
                        </PieChart>

                    </div>

                    <div className="col-12 mt-5">

                        <p className="text-center">Revenues</p>

                        <PieChart width={this.state.width} height={250}>
                          <Pie data={this.state.data.pie_rev} nameKey="title" dataKey="uv" cx="50%" cy="50%" outerRadius={80} label>
                            {this.state.data.pie_rev.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={this.state.data.pie_rev_colors[index]} />
                            ))}
                          </Pie>
                          <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
                        </PieChart>

                    </div>

                    <div className="col-12 mt-5">

                        <p className="text-center">Loans</p>

                        <PieChart width={this.state.width} height={250}>
                          <Pie data={this.state.data.pie_loa} nameKey="title" dataKey="uv" cx="50%" cy="50%" outerRadius={80} label>
                            {this.state.data.pie_loa.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={this.state.data.pie_loa_colors[index]} />
                            ))}
                          </Pie>
                          <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
                        </PieChart>

                    </div>


                </div>
            </div>

        );
    }
}
