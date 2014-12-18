/**
 * ============================================
 *                     OREZ
 * ============================================
 *
 * @author Jakub Hruby - WEB&DTP (http://web-dtp.cz)
 * @version 1.00
 *
 *
 * POZADAVKY
 * ---------
 * knihovna jQuery.js
 *
 *
 * INSTALACE
 * ---------
 * 1. soubor Orez.js ulozte do adresarove struktury vaseho webu
 * 2. soubor nainkludujte do pozadovane stranky, napriklad konstrukci
 *    <script type="text/javascript" src="cesta-k-souboru/WD/Orez.js"></script>
 * 3. pro upravu vychoziho nastaveni je mozne menit hodnoty v bloku VYCHOZI NASTAVENI
 * 4. priklad implementace:
 *
 *    //povinne styly:
 *    <style type="text/css">
 *      .kontejner{position:relative; width:400px; height:200px;}
 *    </style>
 *
 *    //html:
 *    <div class="kontejner"></div>
 *
 *    //volani skriptu:
 *    <script type="text/javacsript">
 *      var orez = new WD.Orez({
 *        sirka: 360,
 *        vyska: 160
 *        x: 20,
 *        y: 20,
 *        zachovat_pomer: true
 *      });
 *    </script>
 *
 *
 * SEZNAM METOD
 * ------------
 * Orez([vlastnosti = array()])
 * setVlastnosti(array vlastnosti)
 * static zkontrolujHodnotuVlastnosti(string vlastnost, mixed hodnota)
 */


/**
 * Vytvori globalni rodicovsky objekt WD.
 */
if(!WD){
  var WD = {};
}

/**
 * Vytvori objekt orezu a nastavi pripadne zmeny ve vlastnostech.
 * @constructor
 * @param {array} vlastnosti Asociativni pole vlastnosti, jedina povinna vlastnost je "rodic", coz je jQuery objekt rodicovskeho elementu
 */
WD.Orez = function (vlastnosti){

  WD.Orez.CHYBA200 = 'Chyba 200: Neznama vlastnost';
  WD.Orez.CHYBA201 = 'Chyba 201: Neplatna hodnota vlastnosti';
  WD.Orez.CHYBA202 = 'Chyba 202: Neplatny argument metody';
  WD.Orez.CHYBA203 = 'Chyba 203: Vlastnost "kontejner" neni jQuery objekt';

  // =========================================================
  //                     VYCHOZI NASTAVENI
  // =========================================================

  WD.Orez.prototype.kontejner;
  WD.Orez.prototype.cssOrez = {
    left: '20px',
    top: '20px',
    background: '#ffffff',
    border: '1px solid #000000',
    cursor: 'move'
  };
  WD.Orez.prototype.cssRoh = {
    width: '8px',
    height: '8px',
    background: '#000000'
  };
  WD.Orez.prototype.sirka = 300;
  WD.Orez.prototype.vyska = 200;
  WD.Orez.prototype.minSirka = 10;
  WD.Orez.prototype.minVyska = 10;
  WD.Orez.prototype.left = 10;
  WD.Orez.prototype.top = 10;
  WD.Orez.prototype.zachovatPomer = true;
  WD.Orez.prototype.poOrezu;

  // ===================================================
  //                     VYKONNY KOD
  // ===================================================

  WD.Orez.povoleneVlastnosti = new Array(
    'kontejner', 'css', 'sirka', 'vyska', 'minSirka', 'minVyska', 'zachovatPomer', 'poOrezu'
  );
  WD.Orez.prototype.orez;
  WD.Orez.prototype.maxSirka;
  WD.Orez.prototype.maxVyska;
  WD.Orez.prototype.minX;
  WD.Orez.prototype.minY;
  WD.Orez.prototype.maxX;
  WD.Orez.prototype.maxY;
  WD.Orez.prototype.x;
  WD.Orez.prototype.y;

  if(typeof(vlastnosti) == 'object'){
    this.setVlastnosti(vlastnosti);
  }
  try{
    if(typeof(this.kontejner) != 'object' || this.kontejner == null){
      throw new Error(Orez.CHYBA203);
    }
    
    //doplneni DOM
    this.kontejner.html(
      '<div class="orez">' +
        '<a data-roh="lt"></a>' +
        '<a data-roh="rt"></a>' +
        '<a data-roh="lb"></a>' +
        '<a data-roh="rb"></a>' +
      '</div>'
    );
    this.orez = this.kontejner.find('.orez');
    this.orez.css(this.cssOrez);
    this.orez.css({
      position: 'absolute',
      width: this.sirka + 'px' ,
      height: this.vyska + 'px' 
    });
    this.orez.find('a').css(this.cssRoh);
    this.orez.find('a').css({
      position: 'absolute',
      display: 'block'
    });
    this.orez.find('a[data-roh="lt"]').css({
      left: '-' + parseInt(this.cssRoh.width)/2 + 'px',
      top: '-' + parseInt(this.cssRoh.height)/2 + 'px',
      cursor: 'nw-resize'
    });
    this.orez.find('a[data-roh="rt"]').css({
      right: '-' + parseInt(this.cssRoh.width)/2 + 'px',
      top: '-' + parseInt(this.cssRoh.height)/2 + 'px',
      cursor: 'ne-resize'
    });
    this.orez.find('a[data-roh="lb"]').css({
      left: '-' + parseInt(this.cssRoh.width)/2 + 'px',
      bottom: '-' + parseInt(this.cssRoh.height)/2 + 'px',
      cursor: 'sw-resize'
    });
    this.orez.find('a[data-roh="rb"]').css({
      right: '-' + parseInt(this.cssRoh.width)/2 + 'px',
      bottom: '-' + parseInt(this.cssRoh.height)/2 + 'px',
      cursor: 'se-resize'
    });
    this.maxSirka = this.kontejner.width() - 2;
    this.maxVyska = this.kontejner.height() - 2;
    this.minX = 0;
    this.minY = 0;
    this.maxX = this.maxSirka;
    this.maxY = this.maxVyska;
    
    var that = this;
      
      //pozice
      this.orez.on('dragstart', function(){
        return false;
      });
      this.orez.on('mousedown', function(ev){
        ev = ev || window.event;
        var orez = $(this);
        var mx = ev.clientX;
        var my = ev.clientY;
        var x1 = orez.position().left;
        var y1 = orez.position().top;
        var w1 = orez.width();
        var h1 = orez.height();
        $(document).on('mousemove', function(ev){
          var dmx = ev.clientX - mx;
          var dmy = ev.clientY - my;
          x2 = Math.min(Math.max(x1 + dmx, that.minX), that.maxX - w1);
          y2 = Math.min(Math.max(y1 + dmy, that.minY), that.maxY - h1);
          
          orez.css({
            left: x2 + 'px',
            top: y2 + 'px'
          });
          that.x = x2;
          that.y = y2;
        });
      });
      
      //zmena rozmeru
      this.orez.find('a').on('dragstart', function(){
        return false;
      });
      this.orez.find('a').on('mousedown', function(ev){
        ev = ev || window.event;
        ev.stopPropagation();
        var roh = $(this);
        var orez = roh.parents('.orez');
        var mx = ev.clientX;
        var my = ev.clientY;
        var x1 = orez.position().left;
        var y1 = orez.position().top;
        var w1 = orez.width();
        var h1 = orez.height();
        
        
        //uprava minimalnich rozmeru podle pomeru
        if(that.zachovatPomer){
          if(w1 > h1){
            that.minSirka = w1 / h1 * that.minVyska;
          }
          else{
            that.minVyska = h1 / w1 * that.minSirka;
          }
        }
        $(document).on('mousemove', function(ev){
          var zachovatPomer = that.zachovatPomer || ev.shiftKey;
          var dmx = ev.clientX - mx;
          var dmy = ev.clientY - my;
          switch(roh.attr('data-roh')){
            case 'lt':
              w2 = w1 - dmx;
              w2 = Math.min(w2, w1 + x1); 
              w2 = Math.max(w2, that.minSirka); 
              h2 = h1 - dmy;
              h2 = Math.min(h2, h1 + y1); 
              h2 = Math.max(h2, that.minVyska);
              if(zachovatPomer){
                w2 = Math.min(w2, w1 / h1 * h2);
                h2 = Math.min(h2, h1 / w1 * w2);
              }
              
              x2 = x1 + dmx;
              x2 = Math.max((w1 + x1) - w2, that.minX);
              y2 = y1 + dmy;
              y2 = Math.max((h1 + y1) - h2, that.minY);
              break;
            case 'rt':
              w2 = w1 + dmx;
              w2 = Math.min(w2, that.maxSirka - x1); 
              w2 = Math.max(w2, that.minSirka); 
              h2 = h1 - dmy;
              h2 = Math.min(h2, h1 + y1); 
              h2 = Math.max(h2, that.minVyska);
              if(zachovatPomer){
                w2 = Math.min(w2, w1 / h1 * h2);
                h2 = Math.min(h2, h1 / w1 * w2);
              }
              
              x2 = x1;
              y2 = y1 + dmy;
              y2 = Math.max((h1 + y1) - h2, that.minY);
              break;
            case 'lb':
              w2 = w1 - dmx;
              w2 = Math.min(w2, w1 + x1); 
              w2 = Math.max(w2, that.minSirka); 
              h2 = h1 + dmy;
              h2 = Math.min(h2, that.maxVyska - y1); 
              h2 = Math.max(h2, that.minVyska);
              if(zachovatPomer){
                w2 = Math.min(w2, w1 / h1 * h2);
                h2 = Math.min(h2, h1 / w1 * w2);
              }
              
              x2 = x1 + dmx;
              x2 = Math.max((w1 + x1) - w2, that.minX);
              y2 = y1;
              break;
            case 'rb':
              w2 = w1 + dmx;
              w2 = Math.min(w2, that.maxSirka - x1); 
              w2 = Math.max(w2, that.minSirka); 
              h2 = h1 + dmy;
              h2 = Math.min(h2, that.maxVyska - y1); 
              h2 = Math.max(h2, that.minVyska);
              if(zachovatPomer){
                w2 = Math.min(w2, w1 / h1 * h2);
                h2 = Math.min(h2, h1 / w1 * w2);
              }
              
              x2 = x1;
              y2 = y1;
              break;
          }
          orez.css({
            left: x2 + 'px',
            top: y2 + 'px',
            width: w2 + 'px',
            height: h2 + 'px'
          });
          that.x = x2;
          that.y = y2;
          that.sirka = w2;
          that.vyska = h2;
        });
      });
      
      //vypnuti udalosti
      $(window).on('mouseup', function(){
        $(document).off('mousemove');
        if(typeof(that.poOrezu) == 'function'){
          that.poOrezu(that);
        }
      });
  }
  catch(e){
    alert(e.message);
  }
}

// ========================================================
//                     DOPLNKOVE METODY
// ========================================================

/**
 * Provede kontrolu vlastnosti nastavenych dane instanci tridy.
 * vlastnost
 * hodnota
 */
WD.Orez.zkontrolujHodnotuVlastnosti = function(vlastnost, hodnota) {
  switch(vlastnost){
    //kladne celociselne typy
    case 'sirka':
    case 'vyska':
    case 'minSirka':
    case 'minVyska':
      var ret = (typeof(hodnota) == 'number' && hodnota > 0 && hodnota == parseInt(hodnota));
      break;
    //logicke typy
    case 'zachovatPomer':
      var ret = (typeof(hodnota) == 'boolean');
      break;
    //objekty
    case 'css':
    case 'kontejner':
      var ret = (typeof(hodnota) == 'object');
      break;
    //funkce
    case 'poOrezu':
      var ret = (typeof(hodnota) == 'function');
      break;
    default:
      var ret = false;
  }
  return ret;
}

/**
 * Nastavi vlastnosti banneru.
 * 
 * @param {array} vlastnosti
 * @throws {Error}
 */
WD.Orez.prototype.setVlastnosti = function(vlastnosti){
  try{
    if(typeof(vlastnosti) != 'object'){
      throw new Error(WD.Orez.CHYBA202);
    }
    var that = this;
    for(index in vlastnosti){
      if($.inArray(index, WD.Orez.povoleneVlastnosti) >= 0){
        if(WD.Orez.zkontrolujHodnotuVlastnosti(index, vlastnosti[index])){
          this[index] = vlastnosti[index];
        }
        else{
          throw new Error(WD.Orez.CHYBA201 + ' "'  + index + '"');
        }
      }
      else{
        throw new Error(WD.Orez.CHYBA200 + ' ' + index + '"');
      }
    }
  }
  catch(e){
    alert(e.message);
  }
}