var $mid = null;
var $right = null;
var $feeds = null;
var pageAccessToken = '';
var fansId = '641827979203549';
var useFilter = true;
var commentsId = null;
var limit = 15
var offset = 0;

$(document).ready(function() {
    $mid = $('.mid');
    $right = $('.right');
    $feeds = $('#feeds');

    $feeds.on('click', 'a', function(e) {
        e.preventDefault();

        $('#feeds').find('a').removeClass('in');
        $(this).addClass('in');
        commentsId = $(this).data('id');
        findComment();
    });

    $('.prev').on('click', function(e) {
        e.preventDefault();
        if (offset > 0) {
            offset -= limit;
            readFeeds();
        } else {
            alert('已經是第一頁')
        }
    });
    $('.next').on('click', function(e) {
        e.preventDefault();
        offset += limit;
        readFeeds();
    });
    $('#filter').on('click', function() {
        if ($(this).is(':checked')) {
            useFilter = true;
        } else {
            useFilter = false;
        }
        findComment();
    })
});

function readFeeds() {
    $mid.html('');
    $right.html('');

    FB.api(
        '/' + fansId + '/feed?limit=' + limit + '&offset=' + offset,
        'GET', {
            access_token: pageAccessToken
        },
        function(response) {
            if (response.data && Object.keys(response).length > 0) {
                parseFeed(response);
            }
        }
    );
}

function parseFeed(feeds) {
    var data = feeds.data;
    var output = '';

    for (var i in data) {
        output += '<li><a href="#" data-id="' + data[i].id + '">' + data[i].message + '</a></li>';
    }

    $feeds.html(output);
}

function findComment() {
    var parse = function(data) {
        var output = '';
        var detail = '';
        var pool = [];
        for (var i in data) {
            if (useFilter) {
                if (pool.indexOf(data[i].from.name) == '-1') {
                    if (data[i].from.name !== '陳薇旭') {
                        output += data[i].from.name + '<br>';
                        detail += '<li>' + data[i].from.name + ' : ' + data[i].message + '</li>';
                        pool.push(data[i].from.name);
                    }
                }
            } else {
                output += data[i].from.name + '<br>';
                detail += '<li>' + data[i].from.name + ' : ' + data[i].message + '</li>';
            }
        }
        if (output === '') {
            output = '無資料';
        }
        $('.mid').html(output);
        $('#detail').html(detail);
    };

    FB.api(
        '/' + commentsId + '/comments',
        'GET', {
            access_token: pageAccessToken,
            limit: 50
        },
        function(response) {
            if (response.data && Object.keys(response).length > 0) {
                parse(response.data);
            }
        }
    );
}

(function() {
    FB.init({
        appId: '924584807668532',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
    });

    FB.getLoginStatus(function(response) {

        if (response.status === 'connected') {

            pageAccessToken = response.authResponse.accessToken
            readFeeds();

        } else if (response.status === 'not_authorized') {
            //尚未通過第一階段授權
            FB.login(function(response) {

                pageAccessToken = response.authResponse.accessToken
                readFeeds();

            }, {
                scope: 'user_managed_groups'
            });
        } else {
            //沒登入FB使用者
            alert("請先登入Facebook網站");
        }
    }, 'user_managed_groups');


})();