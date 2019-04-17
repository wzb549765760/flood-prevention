let aplayAudioCommon = (obj, event, t) => {
//语音播放
  $(".phoneticsMain i")
    .removeClass("focus")
    .addClass("nomal");
  let thisEvent = event.target;
  $("audio").remove();
  let srcs = obj.audioUrl,
    that = $("body"),
    audioWav =
      '<audio controls="controls" id="audioObj" autobuffer="autobuffer"  autoplay="autoplay" hidden>' +
      '<source src="data:audio/wav;base64,' +
      srcs +
      '" type="audio/ogg">' +
      '<source src="data:audio/acc;base64,' +
      srcs +
      '" type="audio/ogg">' +
      "</audio>";
  that.append(audioWav);
  $(thisEvent)
    .find("i")
    .removeClass("nomal")
    .addClass("focus");
  document.getElementById("audioObj").addEventListener("ended", function () {
    $(thisEvent)
      .find("i")
      .removeClass("focus")
      .addClass("nomal");
  });
  document.getElementById("audioObj").ondurationchange = () => {
    let audioTime = document.getElementById("audioObj").duration / t.audioText11.length;
    // document.getElementById("audioObj").playbackRate = 1.8
    console.log(audioTime);
  };
  // let num = 1 + parseFloat(t.value4 / 100);
  document.getElementById("audioObj").playbackRate = 1 + parseFloat(t.value4 / 100);
};

export { //很关键
  aplayAudioCommon
}
