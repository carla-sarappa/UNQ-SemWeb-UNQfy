const unqfy_client = require('./unqfy_client');
const mailer_client = require('./mailer_client');
const validations = require('./business_errors');


class SubscriptionRepository{
  constructor(){
    this.subscriptions = {};
  }


  getAll(artistId){
    return this.subscriptions[artistId] || [];
  }

  add(artistId, email){
    if (!this.subscriptions[artistId]){
      this.subscriptions[artistId] = [];
    }

    if (this.subscriptions[artistId].some(e=> e===email)){
      return;
    }

    this.subscriptions[artistId].push(email);
  }

  remove(artistId, email){
    this.subscriptions[artistId] = this.subscriptions[artistId].filter(e => e !== email);
  }

  clearAll(artistId){
    this.subscriptions[artistId] = [];

  }

}

class NotificationService {
  constructor(){
    this.subscriptions = new SubscriptionRepository();
    this.unqfy = new unqfy_client.UnqfyClient();
    this.mailer = new mailer_client.MailerClient();
  }

  _findArtistId(artistId){
    return this.unqfy.getArtist(artistId)
      .catch(e=> null)
      .then(validations.RelatedEntityNotFoundException.unlessExists)
      .then(e=> e.id);
  }

  getSubscriptions(artistId){
    return this._findArtistId(artistId)
      .then(id=> {
        return {
          artistId: id,
          subscriptors: this.subscriptions.getAll(id) || []
        };
      });
  }

  subscribe(subscription){
    validations.InvalidArgumentException.unlessHasFields(subscription, ['artistId', 'email']);

    return this._findArtistId(subscription.artistId)
      .then(id=>this.subscriptions.add(id, subscription.email));
  }

  unsubscribe(subscription){
    validations.InvalidArgumentException.unlessHasFields(subscription, ['artistId', 'email']);

    return this._findArtistId(subscription.artistId)
      .then(id=>this.subscriptions.remove(id, subscription.email));
  }

  unsubscribeAll(artistId){
    return this._findArtistId(artistId)
      .then(()=>this.subscriptions.clearAll(artistId));
  }

  notify(artistId, subject, message, from){

    const mailOptions = {
      from: from,
      to: this.subscriptions.getAll(artistId).join(', '),
      subject: subject,
      text: message
    };

    return this._findArtistId(artistId)
      .then(()=> this.mailer.sendEmail(mailOptions));
  }

}

module.exports = {
  NotificationService
};