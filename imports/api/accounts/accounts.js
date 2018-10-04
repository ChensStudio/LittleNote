import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

class AccountssCollection extends Mongo.Collection {
  insert(account, callback, language = 'en') {
    const ourAccount = account;
    if (!ourAccount.name) {
      const defaultName = TAPi18n.__('accounts.insert.account', null, language);
      let nextLetter = 'A';
      ourAccount.name = `${defaultName} ${nextLetter}`;
    }
    return super.insert(ourNote, callback);
  }

  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
}

export const Accounts = new AccountssCollection('accounts');

// Deny all client-side updates since we will be using methods to manage this collection
Accounts.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Accounts.schema = new SimpleSchema({
  _id: {        //onchain
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {       //on chain
      type: String 
  },
  address: {    //owner address onchain
    type: String,
    denyUpdate: true,
  },
  createdAt: {  //onchain
    type: Date,
    denyUpdate: true,
  }
});

Accounts.attachSchema(Accounts.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Accounts.publicFields = {
    name: 1,
    address: 1,
    createdAt: 1,
};

Factory.define('account', Accounts, {});

Accounts.helpers({
  editableBy(address) {
    if (!this.address) {
      return true;
    }
    return this.address === address;
  },
});
