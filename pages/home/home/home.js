var app = getApp()
Page({
  data: {
    text: "",
    categoryArray: [],
    ticketShow: [],
    catagorys: [],
    userInfo: {},
    isAllowUser: false,
    winWidth: 0,
    winHeight: 0,
    searchBarWidth: 0,
    inputValue: "",
    isInPut: false,
    searchList: null,
    searchText: ""
  },
  onLoad: function (opt) {
    console.log("首页数据")
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth,
          searchBarWidth: res.windowWidth - 16
        })
      }
    })
    //调用应用实例的方法获取全局数据
    var userInfo = wx.getStorageSync('userInfo')
    console.log("userInfo" + userInfo)
    if (userInfo != "") {
      that.setData({
        isAllowUser: false
      })
    } else {
      that.setData({
        isAllowUser: true
      })
    }
    that.requestData()
  },
  requestData: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      suration: 10000
    })
    console.log("请求数据")
    var that = this;
    var tempData = [{}, {}, {}, {}, {
      name: "全部",
      title: "恋爱犀牛、仙剑",
      image: "",
      id: "0"
    }]
    app.func.requestGet('show/category/', {}, function (cres) {
      for (var j = 0; j < cres.length; j++) {
        console.log(cres[j])
        if (cres[j].name == "话剧歌剧") {
          tempData[1] = cres[j]
        }
        if (cres[j].name == "演唱会") {
          tempData[0] = cres[j]
        }
        if (cres[j].name == "音乐会") {
          tempData[2] = cres[j]
        }
        if (cres[j].name == "体育赛事") {
          tempData[3] = cres[j]
        }
      }

      that.setData({
        categoryArray: tempData,
        // isAllowUser: false
      })
    });

    if (that.data.categoryArray.lenght < 1) {
      that.requestData()
    }
    app.func.requestGet('show/hot/', {}, function (res) {
      for (var i = 0; i < res.length; i++) {
        var dic_count = res[i].min_discount * 10
        res[i].min_discount = dic_count.toFixed(1)
      }
      that.setData({
        ticketShow: res
      })
    });
    setTimeout(function () {
      wx.hideToast()
    }, 500)
    wx.stopPullDownRefresh()
  },
  showTap: function (event) {
    var data = event.currentTarget.dataset.show
    data.cover = ""
    data.category.icon = ""
    if (event.currentTarget.dataset.show.session_count > 1) {
      var show = JSON.stringify(data)
      console.log(show)
      wx.navigateTo({
        url: '../scene/ticket_scen?show=' + show
      })
    } else {
      data.session.venue_map = ""
      var show = JSON.stringify(data)
      console.log(show)
      wx.navigateTo({
        url: '../ticket_desc/ticket_desc?show=' + show
      })
    }
  },

  categoryTap: function (event) {
    var data = event.currentTarget.dataset.category
    data.icon = ""
    wx.navigateTo({
      url: '../category/category?categoty=' + JSON.stringify(data)
    })
  },
  onPullDownRefresh: function () {
    var that = this
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo != "") {
      that.setData({
        isAllowUser: false
      })
      console.log(userInfo.data)
      that.requestData()
    } else {
      that.setData({
        isAllowUser: true
      })
      wx.stopPullDownRefresh()
    }
  },
  requestSearchData: function (data) {
    var that = this
    var url = "show/search/?kw=" + data
    console.log(url)
    app.func.requestGet(url, {}, function (res) {
      for (var i = 0; i < res.show_list.length; i++) {
        var dic_count = res.show_list[i].min_discount * 10
        res.show_list[i].min_discount = dic_count.toFixed(1)
      }
      that.setData({
        searchList: res.show_list
      })
      console.log(that.data.searchList)
    });
  },
  cancelTap: function (e) {
    this.setData({
      isInPut: false,
      searchBarWidth: this.data.winWidth - 16,
      searchText: ""
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
    })
    this.requestSearchData(this.data.inputValue)
  },
  inputFocus: function (e) {
    this.setData({
      isInPut: true,
      searchBarWidth: this.data.winWidth - 75
    })
    console.log(e)
  },

  pullDowne: function (e){
    this.onPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
      title: '良票演出',
      path: 'pages/home/home/home',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})