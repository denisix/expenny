import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Expenses, Revenues, Todos, Cats, Loans } from '../imports/api/db.js'

Meteor.startup(() => { // code to run on server at startup
});

// fixture # 1
found = Cats.find({ t: { $exists: false }}).fetch()
found.map((item, i) => {
	console.log('- old cats found')
	Cats.update(item._id, { $set: { t: 'exp' }})
})

Meteor.publish('exps', () => {
	const userId = this.userId?this.userId:Meteor.userId()
	if (!userId) return []
	return Expenses.find({ owner: userId })
})

Meteor.publish('revs', () => {
	const userId = this.userId?this.userId:Meteor.userId()
	if (!userId) return []
	return Revenues.find({ owner: userId })
})

Meteor.publish('todos', () => {
	const userId = this.userId?this.userId:Meteor.userId()
	if (!userId) return []
	return Todos.find({ $or: [ { owner: userId }, { shareId: userId } ] }, { $sort: { idx: 1 }})
})

Meteor.publish('loans', () => {
	const userId = this.userId?this.userId:Meteor.userId()
	if (!userId) return []
	return Todos.find({ $or: [ { owner: userId }, { shareId: userId } ] }, { $sort: { idx: 1 }})
})

Meteor.publish('cats', function expsPublication() {
	const userId = this.userId?this.userId:Meteor.userId()
	if (!userId) return []
	return Cats.find({ owner: userId })
})

Meteor.publish('all', () => {
	const userId = this.userId?this.userId:Meteor.userId()
	if (!userId) return []

	return [
		Expenses.find({ owner: userId }),
		Revenues.find({ owner: userId }),
		Todos.find({ $or: [ { owner: userId }, { shareId: userId } ] }, { $sort: { idx: 1 }}),
		Loans.find({ $or: [ { owner: userId }, { shareId: userId } ] }, { $sort: { idx: 1 }}),
		Cats.find({ owner: userId }),
	]
})

Meteor.methods({
	'exp.insert'(title,category,price,date) {
		check(title, String);
		check(category, String);
		check(price, Number);
		check(date, String);

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		var catId = null;
		var catFound = Cats.findOne({
			title: category,
			owner: userId,
			t: 'exp',
		});
		catId = catFound ? catFound._id : Cats.insert({
											"title": category,
											owner: userId,
											t: 'exp',
										});

		const affected = Expenses.insert({
			title: title,
			price: price,
			catId: catId,
			owner: userId,
			username: Meteor.users.findOne(userId).username, //Meteor.user().username,
			createdAt: (date == null || date == '') ? new Date() : new Date(date),
	    });

		//console.log('inserted = '+affected);
	},

	'exp.remove'(expId) {
		check(expId, String);

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const exp = Expenses.findOne(expId);
		if (exp.owner !== userId) throw new Meteor.Error('not-authorized');

		Expenses.remove(expId);
	},

	'rev.insert'(title,category,price) {
		check(title, String);
		check(category, String);
		check(price, Number);
		
		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		var catId = null;
		var catFound = Cats.findOne({
			title: category,
			owner: userId,
			t: 'rev',
		});
		catId = catFound ? catFound._id : Cats.insert({
											"title": category,
											owner: userId,
											t: 'rev',
										});

		//console.log('rev.insert => [' + title +'] ['+category+'] ['+price+']');
		const affected = Revenues.insert({
			title: title,
			price: price,
			catId: catId,
			owner: userId,
			username: Meteor.users.findOne(userId).username, //Meteor.user().username,
			createdAt: new Date(),
	    });

		//console.log('inserted = '+affected);
	},
	'rev.remove'(revId) {
		check(revId, String);

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const rev = Revenues.findOne(revId);
		if (rev.owner !== userId) throw new Meteor.Error('not-authorized');

		Revenues.remove(revId);
	},
	'todo.insert'(title, idx) {
		check(title, String);
		check(idx, Number);
		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const affected = Todos.insert({
			title: title,
			owner: userId,
			createdAt: new Date(),
			deadline: null,
			done: false,
			desc: '',
			idx,
			opened: true,
	    });
	},
	'todo.move'(id, oldIdx, newIdx) {
		check(id, String);
		check(oldIdx, Number);
		check(newIdx, Number);
		//console.log(`todo.move: id=${id} old=${oldIdx} new=${newIdx}`)

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Todos.findOne(id)
		if (!ret || ret.owner !== userId) throw new Meteor.Error('not-authorized');

		//console.log('id='+id+' old='+oldIdx+' new='+newIdx);
		const arr = Todos.find({ owner: userId }, { sort: { idx: 1 }, fields: { idx: 1 }}).fetch()
		//console.log(arr)

		let narr = arr
		const item = narr.splice(oldIdx, 1)[0]
		//console.log('old idx='+oldIdx+' item = ', item, "\n", narr)

		narr.splice(newIdx, 0, item)
		//console.log('new idx='+oldIdx+' item = ', item, "\n", narr)

		narr.forEach((i,k) => {
			console.log('k='+k, i)
			if (k !== i.idx) Todos.update({ _id: i._id }, { $set: { idx: k }})
		})
	},
	'todo.opened'(id) {
		check(id, String);
		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Todos.findOne(id);
		if (ret.owner !== userId) throw new Meteor.Error('not-authorized');

		Todos.update({ _id: id}, { $set: { opened: !ret.opened }});
	},
	'todo.title'(id,title) {
		check(id, String);
		check(title, String);
		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Todos.findOne(id);
		if (ret.owner !== userId && ret.shareId !== userId) throw new Meteor.Error('not-authorized');

		Todos.update({ _id: id}, { $set: { title }});
	},
	'todo.desc'(id,desc) {
		check(id, String);
		check(desc, String);
		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Todos.findOne(id);
		if (ret.owner !== userId && ret.shareId !== userId) throw new Meteor.Error('not-authorized');

		Todos.update({ _id: id}, { $set: { desc }});
	},
	'todo.mark'(id,mark) {
		check(id, String);
		check(mark, Number);

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Todos.findOne(id);
		if (ret.owner !== userId && ret.shareId !== userId) throw new Meteor.Error('not-authorized');

		Todos.update({ _id: id}, { $set: { mark }});
	},
	'todo.share'(id,shareId) {
		check(id, String)
		check(shareId, String)

		const userId = this.userId?this.userId:Meteor.userId()
		if (!userId) throw new Meteor.Error('not-authorized')

		const ret = Todos.findOne(id)
		if (ret.owner !== userId) throw new Meteor.Error('not-authorized')
		
		if (shareId == '' || shareId === userId) {
			return Todos.update({ _id: id}, { $set: { shareId: false, shareName: null }})
		}

		const shareName = Meteor.users.findOne(shareId).username
		const shareFrom = Meteor.users.findOne(userId).username
		Todos.update({ _id: id}, { $set: { shareId, shareName, shareFrom }})
	},
	'todo.rem'(id) {
		check(id, String);

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Todos.findOne(id);
		if (ret.owner !== userId) throw new Meteor.Error('not-authorized');

		Todos.remove(id);
	},

//////

	'loan.insert'(title, amount, idx) {
		check(title, String)
		check(amount, Number)
		check(idx, Number)

		const userId = this.userId?this.userId:Meteor.userId()
		if (!userId) throw new Meteor.Error('not-authorized')

		const affected = Loans.insert({
			title: title,
			owner: userId,
			createdAt: new Date(),
			desc: '',
			idx,
			opened: true,
			amount,
			payed: [],
	    });
	},
	'loan.move'(id, oldIdx, newIdx) {
		check(id, String);
		check(oldIdx, Number);
		check(newIdx, Number);
		//console.log(`loan.move: id=${id} old=${oldIdx} new=${newIdx}`)

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Loans.findOne(id)
		if (!ret || ret.owner !== userId) throw new Meteor.Error('not-authorized');

		//console.log('id='+id+' old='+oldIdx+' new='+newIdx);
		const arr = Loans.find({ owner: userId }, { sort: { idx: 1 }, fields: { idx: 1 }}).fetch()
		//console.log(arr)

		let narr = arr
		const item = narr.splice(oldIdx, 1)[0]
		//console.log('old idx='+oldIdx+' item = ', item, "\n", narr)

		narr.splice(newIdx, 0, item)
		//console.log('new idx='+oldIdx+' item = ', item, "\n", narr)

		narr.forEach((i,k) => {
			console.log('k='+k, i)
			if (k !== i.idx) Loans.update({ _id: i._id }, { $set: { idx: k }})
		})
	},
	'loan.opened'(id) {
		check(id, String);
		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Loans.findOne(id);
		if (ret.owner !== userId) throw new Meteor.Error('not-authorized');

		Loans.update({ _id: id}, { $set: { opened: !ret.opened }});
	},
	'loan.title'(id,title) {
		check(id, String);
		check(title, String);
		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Loans.findOne(id);
		if (ret.owner !== userId && ret.shareId !== userId) throw new Meteor.Error('not-authorized');

		Loans.update({ _id: id}, { $set: { title }});
	},
	'loan.amount'(id,amount) {
		check(id, String);
		check(amount, String);
		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Loans.findOne(id);
		if (ret.owner !== userId && ret.shareId !== userId) throw new Meteor.Error('not-authorized');

		Loans.update({ _id: id}, { $set: { amount }});
	},
	'loan.desc'(id,desc) {
		check(id, String);
		check(desc, String);
		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Loans.findOne(id);
		if (ret.owner !== userId && ret.shareId !== userId) throw new Meteor.Error('not-authorized');

		Loans.update({ _id: id}, { $set: { desc }});
	},
	'loan.mark'(id,mark) {
		check(id, String);
		check(mark, Number);

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Loans.findOne(id);
		if (ret.owner !== userId && ret.shareId !== userId) throw new Meteor.Error('not-authorized');

		Loans.update({ _id: id}, { $set: { mark }});
	},
	'loan.share'(id,shareId) {
		check(id, String)
		check(shareId, String)

		const userId = this.userId?this.userId:Meteor.userId()
		if (!userId) throw new Meteor.Error('not-authorized')

		const ret = Loans.findOne(id)
		if (ret.owner !== userId) throw new Meteor.Error('not-authorized')
		
		if (shareId == '' || shareId === userId) {
			return Loans.update({ _id: id}, { $set: { shareId: false, shareName: null }})
		}

		const shareName = Meteor.users.findOne(shareId).username
		const shareFrom = Meteor.users.findOne(userId).username
		Loans.update({ _id: id}, { $set: { shareId, shareName, shareFrom }})
	},
	'loan.amount'(id,amount) {
		check(id, String);
		check(amount, Number);

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Loans.findOne(id);
		if (ret.owner !== userId) throw new Meteor.Error('not-authorized');

		Loans.update({ _id: id}, { $set: { amount }});
	},
	'loan.pay'(id,amount) {
		check(id, String);
		check(amount, Number);

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Loans.findOne(id);
		if (ret.owner !== userId) throw new Meteor.Error('not-authorized');

		const item = {
			date: new Date(),
			amount,
		}

		Loans.update({ _id: id}, { $push: { payed: item }});
	},

	'loan.rem'(id) {
		check(id, String);

		const userId = this.userId?this.userId:Meteor.userId();
		if (!userId) throw new Meteor.Error('not-authorized');

		const ret = Loans.findOne(id);
		if (ret.owner !== userId) throw new Meteor.Error('not-authorized');

		Loans.remove(id);
	},

});
