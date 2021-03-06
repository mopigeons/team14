$(function (){
    EpisodesView =  Backbone.View.extend({
        template:  _.template($("#episodes-list-template").html()),
        el: "#list-episodes",
        templateModal : _.template($("#single-episode-template").html()),
        player : null,
        initialize: function (){
            _.bindAll(this,  'render', 'afterRender');
            var _this = this;
            this.render = _.wrap(this.render, function(render) {
                render();
                _this.afterRender();
                return _this;
            });
        },
        render: function () {
            this.$el.html(this.template({
                results: this.collection.toJSON()
            }))
        },
        afterRender : function() {

            var episodeCollection = this.collection.toJSON();
            var _this = this;


            $('#myTvShowModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget)
                var trackId = $(button).attr('data-trackId');
                _this.modalEpisode(trackId);
            })
            $('#myTvShowModal').on('hidden.bs.modal', function (e) {
                _this.player.stopVideo();
            })

        },
        modalEpisode : function(trackId) {
            var episodeCollection = this.collection.toJSON();
            var elModal = $("#myTvShowModal");
            var templateModal = _.template($("#single-episode-template").html());
            var episodeInModal = {};

            episodeCollection.forEach(function(obj) {
                if(obj.trackId == trackId){
                    episodeInModal = obj;
                }
            });
            elModal.html(templateModal({
                result: episodeInModal
            }))
            this.searchVideoYoutube(episodeInModal.collectionName+" "+episodeInModal.trackCensoredName);


        },
        searchVideoYoutube: function(title){
            var urlBegin = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q="';
            var urlMiddle =  title+' official trailer';
            var urlEnd = '&maxResults=1&order=viewCount&key=AIzaSyBNPujtVRFaQjnXBUMu6kvMj-S6gIiNHYk';
            var urlComplete = urlBegin + urlMiddle + urlEnd;
            var _this = this;

            $.ajax({
                url : urlComplete,
                type : 'GET',
                contentType: 'application/json'
            }).done(function(data) {
                if(data.items.length == 0){
                    $("#episodePlayer").html("No preview find");
                }else{
                    _this.player = new YT.Player('episodePlayer', {
                        height: '300',
                        width: '300',
                        videoId: data.items[0].id.videoId
                    });
                }

            });
        }
    });
});

