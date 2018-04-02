import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Expenses = new Mongo.Collection('expenses');
export const Revenues = new Mongo.Collection('revenues');
export const Cats = new Mongo.Collection('cats');

// Deny all client-side updates on the Lists collection
Expenses.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
});
Revenues.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
});
Cats.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
});


if (Meteor.isServer) {

	// fixture # 1
	found = Cats.find({ t: { $exists: false }}).fetch();
	found.map((item, i) => {
	    console.log('- old cats found');
		Cats.update(item._id, { $set: { t: 'exp' }});
	});

	Meteor.publish('exps', () => {
		const userId = Meteor.userId();
		if (userId) {
			return Expenses.find({ owner: userId });
		}
	});

	Meteor.publish('revs', () => {
		const userId = Meteor.userId();
		if (userId) {
			return Revenues.find({ owner: userId });
		}
	});

	Meteor.publish('cats', function expsPublication() {
		const userId = Meteor.userId();
		if (userId) {
			return Cats.find({ owner: userId });
		}
	});
	
}

Meteor.methods({
	'exp.insert'(title,category,price) {
		check(title, String);
		check(category, String);
		check(price, Number);

		console.log('exp.insert => [' + title +'] ['+category+'] ['+price+']');

		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var catId = null;
		var catFound = Cats.findOne({
			title: category,
			owner: this.userId,
			t: 'exp',
		});
		catId = catFound ? catFound._id : Cats.insert({
											"title": category,
											owner: this.userId,
											t: 'exp',
										});

		console.log('exp.insert category ['+category+'] => id '+catId);

		const affected = Expenses.insert({
			title: title,
			price: price,
			catId: catId,
			owner: Meteor.userId(),
			username: Meteor.users.findOne(this.userId).username, //Meteor.user().username,
			createdAt: new Date(),
	    });

		console.log('inserted = '+affected);
	},

	'exp.remove'(expId) {
		check(expId, String);

		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const exp = Expenses.findOne(expId);
		if (exp.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Expenses.remove(expId);
	},
	'rev.insert'(title,category,price) {
		check(title, String);
		check(category, String);
		check(price, Number);

		var catId = null;
		var catFound = Cats.findOne({
			title: category,
			owner: this.userId,
			t: 'rev',
		});
		catId = catFound ? catFound._id : Cats.insert({
											"title": category,
											owner: this.userId,
											t: 'rev',
										});

		console.log('rev.insert => [' + title +'] ['+category+'] ['+price+']');
		
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const affected = Revenues.insert({
			title: title,
			price: price,
			catId: catId,
			owner: Meteor.userId(),
			username: Meteor.users.findOne(this.userId).username, //Meteor.user().username,
			createdAt: new Date(),
	    });

		console.log('inserted = '+affected);
	},
	'rev.remove'(revId) {
		check(revId, String);

		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const rev = Revenues.findOne(revId);
		if (rev.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Revenues.remove(revId);
	},
});
