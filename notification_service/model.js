const unqfy_client = require('./unqfy_client');
const mailer_client = require('./mailer_client');


class SubscriptionRepository{
  constructor(){
    this.subscriptions = {};
  }


  getAll(artistId){
    return this.subscriptions[artistId];
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

  _findArtistId(artistName){
    return this.unqfy.searchArtist(artistName)
      .then(e=> e[0].id);
  }

  getSubscriptions(artistName){
    return this._findArtistId(artistName)
      .then(id=> {
        return {
          artistId: id,
          subscriptors: this.subscriptions.getAll(id) || []
        };
      });
  }

  subscribe(artistName, email){
    return this._findArtistId(artistName)
      .then(id=>this.subscriptions.add(id, email));
  }

  unsubscribe(artistName, email){
    return this._findArtistId(artistName).then(id=>this.subscriptions.remove(id, email));
  }

  unsubscribeAll(artistName){
    return this._findArtistId(artistName).then(id=>this.subscriptions.clearAll(id));
  }

  notify(artistId, subject, message, from){
    console.log("esto: ", this.subscriptions.getAll(artistId));
    const mailOptions = {
      from: from,
      to: this.subscriptions.getAll(artistId).join(', '),
      subject: subject,
      text: message
    };
    return this.mailer.sendEmail(mailOptions);
  }

}

module.exports = {
  NotificationService
};