<!--ota201904011508-->
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> IOT</el-breadcrumb-item>
                <el-breadcrumb-item>音箱升级</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-container v-if="showFlag">
            <el-main>
                <el-input v-model="keyValue" placeholder="请输入ota-key"
                          style="width:200px;margin-bottom: 20px"></el-input>
                <el-button type="primary" @click="toSearch">查看</el-button>
            </el-main>
        </el-container>
        <el-container v-show="!showFlag">
            <el-header>
                批量升级
                <el-select v-model="value" style="position: absolute;top: 35px;right: 20px" placeholder="请选择"
                           @change="changeTime">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-header>
            <el-main>
                <el-row style="margin: auto auto">
                    <el-button type="primary"><a :href="baseUrl+'/ota/templet'" style="color: white">下载模板</a>
                    </el-button>
                </el-row>

                <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="importFileUrl"
                    :data="upLoadData"
                    accept=".xlsx,.xls"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="handleChange"
                    :on-success="handleSuccess"
                    :file-list="fileList"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
                <el-main>
                    <el-checkbox v-model="checked" style="" :disabled="true">{{checked?"已上传excel":"未上传"}}</el-checkbox>
                </el-main>
                <el-row>
                    <el-button style="width: 200px;" type="danger" @click="submitUpload">批量升级</el-button>
                </el-row>
                <el-table :data="tableData" border style="width: 100%;margin-top: 20px" ref="multipleTable"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="index" label="编号" sortable width=""></el-table-column>
                    <el-table-column prop="sn" label="sn" width=""></el-table-column>
                    <el-table-column prop="mac" label="mac地址" width=""></el-table-column>
                    <el-table-column prop="cmei" label="cmei" width=""></el-table-column>
                    <el-table-column prop="versionId" label="版本ID" width=""></el-table-column>
                </el-table>
                <div class="pages">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="currentSize"
                        background
                        layout="sizes,prev, pager, next"
                        :total="pageNum">
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script type="text/ecmascript-6">

    import {ajaxs} from './../../assets/util/base'

    import {showLoading, hideLoading} from './../../assets/js/loading'
    export default {
        data() {
            return {
                options: [],
                showFlag: true,
                value: '',
                baseUrl: this.$store.getters.getUrl,
                importFileUrl: this.$store.getters.getUrl + '/ota/upload',
                upLoadData: {
                    file: 'ota',
                },
                fileList: [],
                tableData: [],
                currentPage: 1,
                currentSize: 10,
                pageNum: 0,
                updateTime: new Date(),
                checked: false,
                keyValue: ""
            }
        },
        created() {

        },
        computed: {},
        methods: {
            toSearch() {
                let self = this;
                var result = {
                    key: this.keyValue
                };
                ajaxs({
                    type: 'POST',
                    data: result,
                    url: '/ota/secret'
                }).done((_data) => {
                    if (_data.code == "1111") {
                        self.$message.error('ota-key:错误');
                    } else {
                        self.showFlag = false;
                        self.getTimeList();
                        self.sublist();
                    }
                });
            },
            changeTime() {
                this.sublist();
                this.currentPage = 1;
            },
            //用户列表
            sublist() {
                let self = this;
                var result = {
                    time: this.value,
                    pageNo: this.currentPage,
                    pageSize: this.currentSize,
                };
                ajaxs({
                    type: 'POST',
                    data: result,
                    url: '/ota/list'
                }).done((_data) => {
                    if (_data.code == '0000') {
                        self.tableData = _data.data.rows;
                        self.pageNum = parseInt(_data.data["total"]);
                    }
                })

            },
            handleSizeChange(val) {
                this.currentSize = val;
                this.currentPage = 1;
                this.sublist()
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.sublist()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            formateTime(time) {
                let date = new Date(time);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // toJSON 的时区补偿
                return date.toJSON().substr(0, 13).replace(/[-T]/g, ''); //2017021822

            },
            getTimeList() {
                let self = this;
                ajaxs({
                    type: 'POST',
                    url: '/ota/times'
                }).done((_data) => {
                    if (_data.code == "0000") {
                        self.options = [{
                            value: '',
                            label: '升级记录'
                        }];
                        for (var i = 0; i < _data.data.length; i++) {
                            self.options.push({
                                value: _data.data[i],
                                label: _data.data[i]
                            });
                        }
                    }
                })
            },
            //上传部分
            submitUpload() {
                let self = this;
                if (self.fileList.length == 0) {
                    self.$message.error('请先上传文件');
                    return;
                }
                self.$confirm('确认发起升级吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    showLoading();
                    var fileValue = document.querySelector('.el-upload .el-upload__input');
                    var fd = new window.FormData();
                    // 配置post请求的参数。参数名file,后面跟要传的文件，参数名fileType，值为category（看后端的具体要求）
                    fd.append('ota', fileValue.files[0]);
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', self.baseUrl + '/ota/upload', true);
                    // url就是要发送的post请求的地址
                    xhr.send(fd);
                    xhr.onreadystatechange = () => {
                        hideLoading();
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                var data = JSON.parse(xhr.responseText);
                                if (data.code == "0000") {
                                    self.getTimeList();
                                    self.sublist();
                                    self.$confirm('上传成功?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    });
                                   /* self.$message({
                                        message: '上传成功',
                                        type: 'success'
                                    });*/
                                } else if (data.code == '1111') {
                                    self.$confirm(data.desc, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    });

                                }
                            }
                        }
                        if (xhr.status === 200) {

                        }
                    }
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消上传'
                    });
                });


            },
            handleRemove(file, fileList) {
                this.fileList = [];
            },
            handlePreview(file) {
            },
            handleSuccess(file) {
                const self = this;
                self.checked = false;
                //self.fileList = [];
                this.$message({
                    message: '上传成功',
                    type: 'success'
                });
                self.fileList = [];
                self.sublist();
            },
            handleChange(file, fileList) {
                const self = this;
                self.checked = true;
                self.updateTime = new Date();
                if (fileList.length > 1) {
                    fileList.shift()
                }
                self.fileList = fileList;
            },

        },
        filters: {},
        mounted() {

        }
    }
</script>

<style scoped>
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
        font-size: 24px;
    }

    .el-select {
        float: right;
    }

    .upload-demo {
        margin-top: 20px;
    }

    .el-upload {
        margin: auto auto;
        display: block;
        border: 0;
        height: auto;
    }

    button, .el-upload {
        margin: auto auto;
        display: block;
    }

    .el-main {
        text-align: center;
    }
</style>
