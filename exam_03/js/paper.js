/**
 * Created by HC-strawberry on 2016/9/28 0028.
 * 试卷模块
 */
angular.module("app.paperModule",["ng","app.subjectModule"])
    .controller("paperAddController",["$scope","commentService","$rootScope","paperModel","$routeParams",
        function ($scope,commentService,$rootScope,paperModel,$routeParams ) {
        //将查询到的所有方向的数据绑定到作用域中
        commentService.getAllDepartment(function (data) {
            $scope.departments = data;
        })
        $scope.model = paperModel.model;
            var id=$routeParams.id;
            if(id!=0){
                paperModel.addSubjectId(id);
                paperModel.addSubject(angular.copy($routeParams));
            }
            console.log($routeParams);
    }])

    .controller("paperListController",["$scope",function ($scope) {

    }])
    .factory("paperModel",function () {
        return {
            model:{
                dId:1,
                title:"",
                desc:"",
                tt:"",
                at:"",
                scores:[],
                subjectIds:[],
                subjects:[]
            },
            addSubjectId:function (id) {
                this.model.subjectIds.push(id);
            },
            addSubject:function (subject) {
                this.model.subjects.push(subject);
            },
            addScore:function (index,score) {
                this.model.scores[index] = score;
            }
        }
    });
