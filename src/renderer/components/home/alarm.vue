<template></template>

<script>
export default {
  name: "Alarm",
  data() {
    return {
      count: "",
      time: {
        mm: 0,
        ss: 0,
      },
      node: null,
      timer: null,
    };
  },
  methods: {
    open1() {
      this.counter();
      this.$notify({
        title: "警告",
        dangerouslyUseHTMLString: true,
        message: `雨が降ってきました,傘を忘れないでください!`,
        iconClass: "el-icon-bell",
        duration: 0,
        showClose: false,
      });
    },
    counter() {
      this.$nextTick(() => {
        const node = document.getElementsByClassName(
          "el-notification__content"
        )[0];
        //console.log(node, "nodedenodeond");
        const nodeP = node.getElementsByTagName("p")[0];
        nodeP.innerHTML = `雨が降ってきました,傘を忘れないでください!<span id="timer"></span>`;
        this.node = document.getElementById("timer");
        this.node.innerText = `${this.addZero(this.time.mm)}:${this.addZero(
          this.time.ss
        )}経過`;
        this.timer = setInterval(this.secsetup, 1000);
      });
    },
    secsetup() {
      if (this.time.ss < 59) {
        this.time.ss++;
      } else {
        this.time.ss = 0;
        this.time.mm++;
      }
      this.node.innerText = `${this.addZero(this.time.mm)}:${this.addZero(
        this.time.ss
      )}経過`;
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    addZero(val) {
      if (val < 10) {
        return `0${val}`;
      }
      return val;
    },
    setStorage() {
      sessionStorage.setItem("time", JSON.stringify(this.time));
    },
    getStorage() {
      return sessionStorage.getItem("time");
    },
    clearNode() {
      this.clearTimer();
      if (document.getElementsByClassName("el-notification")[0]) {
        document.getElementsByClassName("el-notification")[0].remove();
      }
    },
  },
  mounted() {
    this.clearNode();
    if (JSON.parse(this.getStorage())) {
      this.time = JSON.parse(this.getStorage());
    }
    if (this.$store.state.rain===1) {
      this.open1();
    }
  },
  beforeDestroy() {
    this.setStorage();
    this.clearNode();
  },
  computed: {
    listData() {
      return this.$store.state.rain;
    },
  },
  watch: {
    listData(val) {
      if (val === 0) {
        this.clearNode();
        this.time.ss = 0;
        this.time.mm = 0;
        this.setStorage();
      } else {
        this.clearTimer();
        if (JSON.parse(this.getStorage())) {
          this.time = JSON.parse(this.getStorage());
        }
        this.open1();
      }
    },
  },
};
</script>

<style>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  20% {
    transform: rotate(10deg);
  }

  40% {
    transform: rotate(-10deg);
  }

  60% {
    transform: rotate(20deg);
  }

  80% {
    transform: rotate(-20deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

.el-icon-bell {
  transition: all 0.5s;
  transform-origin: top center;
  animation: rotate 2s linear infinite;
}

#timer {
  display: flex;
  justify-content: flex-end;
}
</style>