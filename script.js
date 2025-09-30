	(function(){
	  // координаты банкетного зала
	  const HALL_COORDS  = [54.629800, 43.203700]; // Флагман, Темников

	  // храним ссылку на карту
	  let map = null;

	  function createMap(id, center, title){
	    const mapInstance = new ymaps.Map(id, { center, zoom: 18, controls: ['zoomControl'] });
	    const pm  = new ymaps.Placemark(center, { hintContent: title, balloonContent: title }, { preset: 'islands#redHeartIcon' });
	    mapInstance.geoObjects.add(pm);
	    map = mapInstance;
	    return mapInstance;
	  }

	  // лёгкий debounce, чтобы не дёргать карту слишком часто
	  function debounce(fn, ms){
	    let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn.apply(null,args), ms); };
	  }

	  // при изменении ширины: подгоняем вьюпорт и возвращаем центр, чтобы метка не «уплывала»
	  const refitMap = debounce(function(){
	    if(!map || !map.container) return;
	    const c = map.getCenter();
	    map.container.fitToViewport();
	    map.setCenter(c);
	  }, 120);

	  ymaps.ready(function(){
	    createMap('map-hall', HALL_COORDS, 'Банкетный зал «Флагман»');

	    // подстроить сразу после первого рендера (на случай поздней загрузки шрифтов)
	    setTimeout(refitMap, 50);
	    // и на ресайз окна
	    window.addEventListener('resize', refitMap);
	    // плюс когда сетка меняется из-за медиазапроса (часто хватает одного таймера)
	    window.matchMedia('(min-width:1100px)').addEventListener('change', refitMap);
	  });
	})();


    // Копирование адреса с тостом
    (function(){
      var toast = document.getElementById('toast');
      function bindCopy(id){
        var el = document.getElementById(id); if(!el) return;
        el.addEventListener('click', async function(){
          var text = el.getAttribute('data-copy') || el.textContent.trim();
          try{ await navigator.clipboard.writeText(text); }
          catch(e){
            var r = document.createRange(); r.selectNodeContents(el);
            var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            document.execCommand('copy'); s.removeAllRanges();
          }
          if(toast){ toast.textContent='Скопировано'; toast.classList.add('toast--show'); setTimeout(function(){ toast.classList.remove('toast--show'); }, 1200); }
        });
      }
      // Привязываем только к адресу банкетного зала
      bindCopy('address');
    })();

    // Таймер до свадьбы (14.02.2026 13:00 МСК)
    (function(){
      var target = new Date("2026-02-14T13:00:00+03:00");
      function pad(n){return n<10?('0'+n):n}
      function tick(){
        var now = new Date();
        var diff = target - now; if(diff < 0) diff = 0;
        var s = Math.floor(diff/1000);
        var d = Math.floor(s/86400); s%=86400;
        var h = Math.floor(s/3600); s%=3600;
        var m = Math.floor(s/60); var sec = s%60;
        document.getElementById("cd-days").textContent = d;
        document.getElementById("cd-hours").textContent = pad(h);
        document.getElementById("cd-mins").textContent = pad(m);
        document.getElementById("cd-secs").textContent = pad(sec);
      }
      tick(); setInterval(tick, 1000);
    })();

    // Плавное появление обложки
    (function(){
      var img = document.querySelector('.hero__bg img');
      function reveal(){ document.body.classList.add('is-hero-loaded'); }
      if(!img) return;
      if(img.complete){ requestAnimationFrame(reveal); }
      else { img.addEventListener('load', function(){ requestAnimationFrame(reveal); }, { once:true }); setTimeout(reveal, 2000); }
    })();

    // Отключение параллакса на iOS
    (function(){
      function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      }
      
      if (isIOS()) {
        // Добавляем класс для iOS - CSS сам отключит параллакс
        document.documentElement.classList.add('ios-device');
      }
    })();


    