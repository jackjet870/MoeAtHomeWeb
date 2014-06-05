﻿
moeathomeApp.controller('viewBlogCtrl', ['$scope', '$http', '$routeParams', '$sce',
    function ($scope, $http, $routeParams, $sce) {
        var date = $routeParams.date;
        var title = $routeParams.title;

        var getBlogUrl = function (date, title) {
            return '/api/blogs/' + date + "/" + title;
        }
        var getCommentsUrl = function (date, title, lastTick) {
            return '/api/blogs/comments/' + date + "/" + title + "/" + lastTick;
        };
        var postCommentUrl = function (date, title) {
            return 'api/blogs/comments/' + date + "/" + title;
        };

        var highlight = function () {
            $('pre').each(function (i, e) {
                hljs.highlightBlock(e);
                var $block = $('<div class="ui code segment"><table><tr><td class="gutter"/><td>'
                    + e.outerHTML + '</td></tr></table></div>');
                $(e).replaceWith($block);
            });
            $('.gutter').each(function (i, e) {
                var $thePre = $('pre', $(e).parent());
                var lineCount = $thePre.height() / parseFloat($thePre.css('line-height'));
                for (var i = 0; i < lineCount; i++) {
                    $(e).append("<div class='line-number'>" + (i + 1) + "</div>");
                }
            });
        };

        var renderContent = function (html) {
            $('.blog-content').html(html);
            highlight();
        };

        var getBlog = function () {
            $http({
                method: 'GET',
                url: getBlogUrl(date, title)
            }).success(function (data, status) {
                if (data != 'null') {
                    document.title = data.title + " - Moe@Home";
                    $scope.blog = data;
                    $('#post').css('display', 'block');
                    renderContent(data.content);
                }
                else {
                    document.title = "没找到这篇文章 - Moe@Home";
                    $('#post-notfound').css('display', 'block');
                }
            }).error(function (data, status) {
                // Some error occurred
            });
        };

        $scope.range = function (n) {
            return new Array(n);
        };

        $scope.comments = [];
        $scope.lastTick = 0;
        //加载评论
        var loadComments = function () {
            $http({
                method: 'GET',
                url: getCommentsUrl(date, title, $scope.lastTick)
            }).success(function (data, status) {
                if (data != 'null') {
                    $scope.comments = data;
                }
            }).error(function (data, status) {
                // Some error occurred
            });
        };

        $scope.onLoaded = function () {
            getBlog();
            loadComments();
        };

        $scope.enableValidate = false;

        //评论内容
        $scope.commentContent = {
            value: '',
            hasError: function () {
                return $scope.enableValidate && $scope.commentContent.value == '';
            },
            errorMessage: '内容不能为空哦。'
        };
        //发表评论
        $scope.postComment = function () {
            $scope.enableValidate = true;
            if (!$scope.commentContent.hasError()) {
                $http({
                    method: 'POST',
                    url: postCommentUrl(date, title),
                    data: $.param({
                        content: $scope.commentContent.value
                    }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function (data, status) {
                    //清空评论内容
                    $scope.commentContent.value = '';
                    $scope.enableValidate = false;
                    //重新加载
                    loadComments();
                }).error(function (data, status) {
                    if (data && data.error_description) {
                        $scope.errors.push(data.error_description);
                    } else {
                        $scope.errors.push("发生了奇怪的问题。");
                    }
                });
            }
        };

        $scope.parseDate = function (date) {
            var value = new Date(date);
            return value.toLocaleDateString();
        };

        $scope.parseDateTime = function (date) {
            var value = new Date(date);
            return value.toLocaleString();
        };

        $scope.parseAuthor = function (author) {
            return author == null ? '匿名' : author;
        };
    }]);