/**
 * Created by HC-strawberry on 2016/9/22 0022.
 * 项目的核心js
 */
//左侧导航动画
//jQuery代码
$(function () {
    //收起子导航栏
    $(".baseUI>li>ul").slideUp("fast");

    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function () {
        $(".baseUI>li>ul").slideUp("fast");//先让所有的ul都合起来
        $(this).next().slideDown();//选到了被点击的a的下一个兄弟节点ul，使之展开
    });
    //默认让第一个展开
    $(".baseUI>li>a").eq(0).trigger("click");
    //背景改变
    $(".baseUI ul>li").off("click");
    $(".baseUI ul>li").on("click",function () {
        //alert(1);
        if(!$(this).hasClass("current")){ //如果没有class，加上class
            $(".baseUI ul>li").removeClass("current"); //先把所有的class去掉
            $(this).addClass("current");
        }
    });
    //模拟点击全部题目
    $(".baseUI ul>li").eq(0).find("a").trigger("click");
});

//项目核心模块
//angularJS代码
                                        //app.subjectModule与核心模块的整合
angular.module("app",["ng","ngRoute","app.subjectModule","app.paperModule"])
    .controller("mainController",["$scope",function ($scope) {
                                    //防止打包的时候把$scope当成形参，所以先列出来，前面的元素表示要注入的内容
        //配置阶段 ↓必须这样注入
    }]).config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/SubjectList/dpId/:dpId/topicId/:topicId/levelId/:levelId/typeId/:typeId",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/SubjectAdd",{
            templateUrl:"tpl/subject/subjectAdd.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelController"
        }).when("/SubjectCheck/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController"
            }).when("/PaperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/PaperAddSubject",{
            templateUrl:"tpl/paper/subjectAddList.html",
            controller:"subjectController"
        });
    }]);
