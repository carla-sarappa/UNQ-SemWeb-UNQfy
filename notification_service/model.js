const unqfy_client = require('./unqfy_client');


class SubscriptionRepository{
  constructor(){
    this.subscriptions = {};
  }


  getAll(artistId){
    return this.subscriptions[artistId];
  }

  add(artistId, email){
    console.log(artistId, email);
    if (!this.subscriptions[artistId]){
      this.subscriptions[artistId] = [];
    }

    this.subscriptions[artistId].push(email);
    console.log(this.subscriptions);
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

}

module.exports = {
  NotificationService
};