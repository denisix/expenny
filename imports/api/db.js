import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const Expenses = new Mongo.Collection('expenses')
export const Revenues = new Mongo.Collection('revenues')
export const Todos = new Mongo.Collection('todos')
export const Loans = new Mongo.Collection('loans')
export const Cats = new Mongo.Collection('cats')

Expenses.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
})
Revenues.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
})
Todos.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
})
Loans.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
})
Cats.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; },
})
