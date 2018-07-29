const unqfy_client = require('./unqfy_client');
const mailer_client = require('./mailer_client');


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
    console.log("mi artist id: ", artistId);
    return this.unqfy.getArtist(artistId)
      .then(e=>{
        console.log(e);
        return e;
      })
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

  subscribe(artistId, email){
    return this._findArtistId(artistId)
      .then(id=>this.subscriptions.add(id, email));
  }

  unsubscribe(artistId, email){
    return this._findArtistId(artistId).then(id=>this.subscriptions.remove(id, email));
  }

  unsubscribeAll(artistId){
    this.subscriptions.clearAll(artistId);
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