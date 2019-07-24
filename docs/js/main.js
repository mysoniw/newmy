window.addEventListener('DOMContentLoaded', function () {
  var Vue = window.Vue;
  var URL = window.URL || window.webkitURL;
  var ImageCompressor = window.ImageCompressor;

  new Vue({
    el: '#app',

    data: function () {
      var vm = this;

      return {
        options: {
          checkOrientation: true,
          maxWidth: undefined,
          maxHeight: undefined,
          minWidth: 0,
          minHeight: 0,
          width: undefined,
          height: undefined,
          quality: 0.8,
          mimeType: '',
          convertSize: 5000000,
          success: function (file) {
            console.log('Output: ', file);

            var formData = new FormData();
            formData.append("file", file, file.name);
            
            // 파일 업로드 
            $.ajax({
              url: "/fileupload",
              enctype: "multipart/form-data",
              processData: false,
              contentType: false,
              data: formData,
              type: "POST",
              cache: false,
              timeout: 600000,
              success: function(result) {
                alert("업로드 성공!!");
              },
              error: function(e) {
                alert("업로드 실패!!");
              }
            });
            
            if (URL) {
              vm.outputURL = URL.createObjectURL(file);
            }

            vm.output = file;
            vm.$refs.input.value = '';
          },
          error: function (e) {
            window.alert(e.message);
          },
        },
        inputURL: '',
        outputURL: '',
        input: {},
        output: {},
      };
    },

    filters: {
      prettySize: function (size) {
        var kilobyte = 1024;
        var megabyte = kilobyte * kilobyte;

        if (size > megabyte) {
          return (size / megabyte).toFixed(2) + ' MB';
        } else if (size > kilobyte) {
          return (size / kilobyte).toFixed(2) + ' KB';
        } else if (size >= 0) {
          return size + ' B';
        }

        return 'N/A';
      },
    },

    methods: {
      compress: function (file) {
        if (!file) {
          return;
        }

        console.log('Input: ', file);

        if (URL) {
          this.inputURL = URL.createObjectURL(file);
        }

        this.input = file;
        new ImageCompressor(file, this.options);
      },

      change: function (e) {
        this.compress(e.target.files ? e.target.files[0] : null);
      },

      dragover: function(e) {
        e.preventDefault();
      },

      drop: function(e) {
        e.preventDefault();
        this.compress(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
      },
    },
  });
});
