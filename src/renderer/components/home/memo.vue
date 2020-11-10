<template>
    <el-card class="memo" :body-style="{ padding: '0px' }">
        <div class="top shadow">
            <!-- 删除 -->
            <div>
                <button class="del" @click="delmemo">
                    <i class="el-icon-delete"></i>
                </button>
            </div>
            <!-- 添加 -->
            <el-popover placement="right-start" width="300" trigger="click">
                <el-date-picker class="add-date" v-model="value2" type="date" placeholder="予定日を選択してください。" :picker-options="pickerOptions" value-format="timestamp"></el-date-picker>
                <el-input class="add-content" placeholder="予定の内容を入力してください。" :rows="4" v-model="input" clearable @keyup.enter.native="adddate"></el-input>
                <el-button type="success" icon="el-icon-check" size="mini" v-on:click="adddate" circle></el-button>
                <!-- 添加按钮 -->
                <button class="add-memo" slot="reference">
                    <i class="el-icon-plus"></i>
                </button>
            </el-popover>
        </div>
        <div class="content" style="margin: 10px">
            <div>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
                <el-checkbox-group v-model="checkedmemo" @change="handleCheckedmemoChange">
                    <div>
                        <el-checkbox v-for="(item, index) of sortmemo" :key="index" :label="item">
                            <div class="item">
                                {{ item.msg }}まで、あと<span v-if="item.count < 5" style="color: red">{{ item.count }}</span><span v-else style="color: black">{{ item.count }}</span>日
                            </div>
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
            </div>
        </div>
    </el-card>
</template>

<script>
    const fs = require("fs");
    export default {
        data() {
            return {
                pickerOptions: {
                    // disabledDate(time) {
                    //   return time.getTime() > Date.now();
                    // },
                    shortcuts: [{
                            text: "今日",
                            onClick(picker) {
                                picker.$emit("pick", new Date());
                            },
                        },
                        {
                            text: "昨日",
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                picker.$emit("pick", date);
                            },
                        },
                        {
                            text: "一週間前",
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit("pick", date);
                            },
                        },
                    ],
                },
                value2: "",
                input: "",
                memo: [],
                data: {},
                checkedmemo: [],
                checkAll: false,
                isIndeterminate: true,
            };
        },
        methods: {
            adddate: function() {
                const max_num = 10;
                if (this.value2 === "" || this.input === "" || this.issame()) {
                    this.inputerror();
                } else {
                    if (this.memo.length <= max_num) {
                        let now = new Date();
                        now = Math.floor(now.getTime() / 86400000);
                        let count = Math.floor((this.value2 / 86400000)) - now;
                        this.data = {
                            msg: this.input,
                            count: count,
                            date: this.value2,
                        };
                        this.memo.push(this.data);
                        this.saveTofile();
                        this.input="";
                    } else {
                        this.fullerror();
                    }
                }
            },
            saveTofile: function() {
                let data_str = [];
                this.memo.forEach((item) => {
                    data_str.push(JSON.stringify(item));
                });
                data_str = data_str.join("\n");
                fs.writeFile("mydata.txt", data_str, (err) => {
                    console.log(err);
                });
            },
            inputerror() {
                this.$message({
                    showClose: true,
                    message: "入力エラーです",
                    type: "error",
                });
            },
            fullerror() {
                this.$message({
                    showClose: true,
                    message: "データ保存の上限に達しました",
                    type: "error",
                });
            },
            sortcount(a, b) {
                return a.count - b.count;
            },
            handleCheckAllChange(val) {
                this.checkedmemo = val ? this.memo : [];
                this.isIndeterminate = false;
            },
            handleCheckedmemoChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.memo.length;
                this.isIndeterminate =
                    checkedCount > 0 && checkedCount < this.memo.length;
            },
            issame() {
                let flag = false;
                for (let i = 0; i < this.memo.length; i++) {
                    if (
                        this.memo[i].msg === this.input &&
                        this.memo[i].date === this.value2
                    ) {
                        flag = true;
                        break;
                    }
                }
                return flag;
            },
            delmemo() {
                this.checkedmemo.forEach((item)=> {
                    let temp=[];
                    for (let i = 0; i < this.memo.length; i++) {
                        if (item === this.memo[i]) {
                            continue;
                        }else {
                            temp.push(this.memo[i]);
                        }
                    }
                    //console.log(temp);
                    this.memo=[];
                    this.memo=temp.splice(0);
                });
                this.checkedmemo=[];
                //console.log(this.memo);  
                this.saveTofile();
            }
        },
        created: function() {
            fs.readFile("mydata.txt", "utf-8", (err, data) => {
                if (data != "") {
                    let temp = data.split("\n");
                    if(temp[temp.length-1]==="")temp.splice(temp.length-1,1);
                    //console.log(temp);
                    let array = [];
                    temp.forEach((item, index) => {
                        array.push(JSON.parse(item));
                    });
                    //console.log(array);
                    array.forEach((item) => {
                        this.memo.push(item);
                    });
                }
            });
        },
        computed: {
            sortmemo() {
                let temp = this.memo;
                temp.sort(this.sortcount);
                return temp;
            },
        },
    };
</script>

<style scoped>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    tr {
        border-bottom: 1px solid #d6d499;
        font-size: 20px;
    }

    .memo {
        padding: 0px;
        width: 300px;
        height: 400px;
        position: fixed;
        background: #fffdc2;
        top: calc(50% - 100px);
        left: 30px;
    }

    .top {
        height: 50px;
        background: #532a16;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
    }

    .add-memo {
        background: #3a1e10;
        border: #3a1e10;
        color: #fff;
        border: #30190d;
        border-radius: 20%;
        padding: 8px;
    }

    .del {
        background: #3a1e10;
        border: #3a1e10;
        color: #fff;
        border: #30190d;
        border-radius: 20%;
        padding: 8px;
    }

    .add-date {
        width: 85% !important;
    }

    .add-content {
        width: 85%;
        margin: 15px 15px 0 0;
    }

    .shadow {
        position: relative;
        max-width: 270px;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3),
            0px 0px 20px rgba(0, 0, 0, 0.1) inset;
    }

    .item {
        white-space: normal;
        text-decoration: underline;
        text-decoration-color: #aaa;
        font-size: 18px;
    }

    .el-checkbox {
        display: flex;
        align-content: flex-start;
        padding: 3px 0;
    }

    ::v-deep .el-checkbox__input {
        display: block;
        padding-top: 4px;
    }

    .shadow::before,
    .shadow::after {
        content: "";
        position: absolute;
        z-index: -1;
    }

    .shadow::before,
    .shadow::after {
        content: "";
        position: absolute;
        z-index: -1;
        bottom: 15px;
        left: 10px;
        width: 50%;
        height: 20%;
    }

    .shadow::before,
    .shadow::after {
        content: "";
        position: absolute;
        z-index: -1;
        bottom: 15px;
        left: 10px;
        width: 50%;
        height: 20%;
        box-shadow: 0 15px 10px rgba(0, 0, 0, 0.7);
        transform: rotate(-3deg);
    }

    .shadow::after {
        right: 10px;
        left: auto;
        transform: rotate(3deg);
    }

    .el-card {
        border: none;
    }
</style>