/**
 * Created by HC-strawberry on 2016/9/22 0022.
 * 题库模块
 */
//angular
                //命名空间       要与核心模块整合
angular.module("app.subjectModule",["ng"])
    //控制器
    .controller("subjectDelController",["$routeParams","$location","subjectService",function ($routeParams,$location,subjectService) {
        var flag = confirm("确认删除吗？");
        if(flag){
            //删除
            subjectService.delSubject($routeParams.id,function (data) {
                alert(data);
            });
        }
        //跳转
        $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    .controller("subjectCheckController",["$routeParams","$location","subjectService",function ($routeParams,$location,subjectService) {
        //审核
        subjectService.checkSubject($routeParams.id,$routeParams.state,function (data) {
            alert(data);
        });
        //跳转
        $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
                                                    // ↓将下面写好的服务名字注入
    .controller("subjectController",["$scope","commentService","subjectService","$filter","$routeParams","$location",
        function ($scope,commentService,subjectService,$filter,$routeParams,$location) {
        //调用服务方法加载题目属性信息，并进行绑定
            $scope.params = $routeParams;
            //默认勾选显示正确答案
            $scope.isShow = true;
            //封装筛选数据时用的模板对象
            var subjectModel =(function () {
                var obj = {};
                if($routeParams.typeId!=0){
                    obj['subject.subjectType.id'] = $routeParams.typeId;
                }
                if($routeParams.dpId!=0){
                    obj['subject.department.id'] = $routeParams.dpId;
                }
                if($routeParams.topicId!=0){
                    obj['subject.topic.id'] = $routeParams.topicId;
                }
                if($routeParams.levelId!=0){
                    obj['subject.subjectLevel.id'] = $routeParams.levelId;
                }
                console.log("参数对象",obj);
                return obj;
            })();
            //添加页面中的默认数据
            $scope.model={
                typeId:1,
                levelId:1,
                departmentId:1,
                topicId:1,
                stem:"",
                answer:"",
                analysis:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            $scope.add=function () {
                //调用service方法完成题目的保存
                subjectService.saveSubject($scope.model,function (data) {
                    alert(data);
                });
                var model = {
                    typeId :1,
                    levelId:1,
                    departmentId:1,
                    topicId:1,
                    stem:"",
                    answer:"",
                    analysis:"",
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false]
                };
                //重置$scope
                angular.copy(model,$scope.model);
            }
            $scope.addAndClose = function () {
                //调用service方法完成题目保存
                subjectService.saveSubject($scope.model,function (data) {
                    alert(data);
                    //跳转到列表页面
                    $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
                });
            }

            //服务调用
            commentService.getAllType(function (data) {
                $scope.types = data;
            });
            commentService.getAllDepartment(function (data) {
                $scope.departments = data;
            });
            commentService.getAllTopic(function (data) {
                $scope.topics = data;
            });
            commentService.getAllLevel(function (data) {
                $scope.levels = data;
            });
            //调用subjectService获取所有题目信息
            subjectService.getAllSubjects(subjectModel,function (data) {
                //遍历所有的题目，计算出选择题的答案，并且将答案赋给subject.answer
                data.forEach(function (subject) {
                    //获取正确答案
                    if(subject.subjectType && subject.subjectType.id != 3){
                        var answer = [];
                        subject.choices.forEach(function (choice,index) {
                            if(choice.correct){
                                //将索引转换为A/B/C/D
                                var no = $filter('indexToNo')(index);
                                answer.push(no);
                            }
                        });
                        //将计算出来的正确答案赋给subject.answer
                        subject.answer = answer.toString();
                    }

                });
                $scope.subjects = data;
            });
    }])

    //题目服务，封装操作题目的函数
    .service("subjectService",["$http","$httpParamSerializer",function ($http,$httpParamSerializer) {
        this.checkSubject = function (id,state,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':state
                }
            }).success(function (data) {
                handler(data);
            });
        };
        this.delSubject = function (id,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    'subject.id':id
                }
            }).success(function (data) {
                handler(data);
            });
        };

        this.getAllSubjects = function (params,handler) {
            // http://127.0.0.1:8080/test/exam/manager/getAllSubjects.action  data/subjects.json
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                params:params
            }).success(function (data) {
                //$http.get("").success(function (data) {
                handler(data);
            });
        };
        //添加题目
        this.saveSubject = function (params,handler) {
            //将参数转换为angular需要的数据格式
            var obj = {};
            for(var key in params){
                var val = params[key];
                switch (key){
                    case "typeId":
                        obj['subject.subjectType.id']=val;
                        break;
                    case "levelId":
                        obj['subject.subjectLevel.id']=val;
                        break;
                    case "departmentId":
                        obj['subject.department.id']=val;
                        break;
                    case "topicId":
                        obj['subject.topic.id']=val;
                        break;
                    case "stem":
                        obj['subject.stem']=val;
                        break;
                    case "answer":
                        obj['subject.answer']=val;
                        break;
                    case "analysis":
                        obj['subject.analysis']=val;
                        break;
                    case "choiceContent":
                        obj['choiceContent']=val;
                        break;
                    case "choiceCorrect":
                        obj['choiceCorrect']=val;
                        break;
                }
            }
            //将对象数据转换为表单编码样式的数据
            obj = $httpParamSerializer(obj);
            //post的参数（url，要传的参数，{ 配置对象 }）
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function (data) {
                handler(data);
            });
        }
    }])
    //公共服务 用于获取题目相关信息 从服务拿 用于获取题型难度方向知识点
            //名字要注入controller
    .factory("commentService",["$http",function ($http) {
        return {
            getAllType:function(handler){
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                $http.get("data/types.json").success(function (data) {
                    handler(data);
                });
            },
            getAllDepartment:function(handler){
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                $http.get("data/departments.json").success(function (data) {
                    handler(data);
                });
            },
            getAllTopic:function(handler){
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                $http.get("data/topics.json").success(function (data) {
                    handler(data);
                });
            },
            getAllLevel:function(handler){
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                $http.get("data/levels.json").success(function (data) {
                    handler(data);
                });
            }
        }
    }])
    //过滤器
    .filter("selectTopics",function () {
        //input为topic数组，id为部门id
        return function (input, id) { //input为要过滤的内容 | 前面的值，id为冒号后面的值
            if(input){//不做判断的话可能会调用两次
                //通过array中的过滤器函数过滤满足条件的topic
                var arr=input.filter(function (item,index) {
                    return item.department.id==id;
                return arr;
                });
            }
        }
    })
    .filter("indexToNo",function () {
        return function (input) {
            //return input==0?'A':(input==1?'B');
            var result;
            switch (input){
                case 0:
                    result='A';
                    break;
                case 1:
                    result='B';
                    break;
                case 2:
                    result='C';
                    break;
                case 3:
                    result='D';
                    break;
                case 4:
                    result='E';
                    break;
                default:
                    result = 'F';
            }
            return result;
        }
})
    .directive("selectOption",function () {
        return {
            restrict:"A",
            link:function (scope,element) {
                element.on("change",function () {
                    var type = element.attr("type");
                    var isCheck = element.prop("checked");
                    if(type == "radio"){
                        scope.model.choiceCorrect = [false,false,false,false];
                        var index = angular.element(this).val(); //这里的angular.element()相当于$()
                        scope.model.choiceCorrect[index] = true;
                    }else if(type == "checkbox" && isCheck ){
                        var index = angular.element(this).val();
                        scope.model.choiceCorrect[index] = true;
                    }
                    //强制将scope更新
                    scope.$digest();
                });
            }
        }
    });


