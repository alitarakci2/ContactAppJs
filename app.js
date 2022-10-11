const ad = document.getElementById('ad');
const soyad = document.getElementById('soyad');
const mail = document.getElementById('mail');
const kisiListesi = document.querySelector('.kisi-listesi');



const form = document.getElementById('form-rehber');

//evetn listenerlarin tanimlanmasi

form.addEventListener('submit', kaydet)
kisiListesi.addEventListener('click', kisiIslemleriniYap);

const tumKisilerDizisi = [];

function kisiIslemleriniYap(event){

   
    if(event.target.classList.contains('btn--delete')){
        const silinecekTr = event.target.parentElement.parentElement;
        const silinecekMail = event.target.parentElement.previousElementSibling.textContent;
        rehberdenSil(silinecekTr, silinecekMail);
    }else if(event.target.classList.contains('btn--edit')){
        console.log("guncelleme")
    }

}

function rehberdenSil(silinecekTrElement, silinecekMail){
    silinecekTrElement.remove();

    console.log(silinecekTrElement, silinecekMail);

    tumKisilerDizisi.forEach((kisi, index) => {
            if(kisi.mail === silinecekMail){
                tumKisilerDizisi.splice(index,1);
            }
    });

    console.log("silme yapildi");
    console.log(tumKisilerDizisi);

}
function kaydet(e){
    e.preventDefault();

const eklenecekKisi = {
    ad: ad.value,
    soyad: soyad.value,
    mail: mail.value

  }

  const sonuc = verileriKontrolEt(eklenecekKisi);
  if(sonuc.durum){
    kisiyiEkle(eklenecekKisi);
 
  


  }else{
    bilgiOlustur(sonuc.mesaj,sonuc.durum);
   
  }

}

function verileriKontrolEt(kisi){
    for(const deger in kisi){
      if(kisi[deger]){
          console.log(kisi[deger])
      }else{
          
          const sonuc = {
              durum: false,
              mesaj : 'Bos alan birakmayiniz'
          }

          return sonuc;
      }


  }
  alanlariTemizle();
  return {

    
      durum: true,
      mesaj: 'Kaydedildi'
  }

}

function bilgiOlustur(mesaj,durum){
    const olusturulanBilgi = document.createElement('div');


    olusturulanBilgi.textContent = mesaj;
    olusturulanBilgi.className = 'bilgi';
    if(durum){
        olusturulanBilgi.classList.add('bilgi--success');
    }else{
        olusturulanBilgi.classList.add('bilgi--error');

    }

    document.querySelector('.container').insertBefore(olusturulanBilgi,form)

    setTimeout(function(){
        const silinecekDiv = document.querySelector('.bilgi');
        if(silinecekDiv){
            silinecekDiv.remove();
        }

    },2000)

}

function alanlariTemizle(){
    ad.value = '';
    soyad.value = '';
    mail.value = '';
}

function kisiyiEkle(eklenecekKisi){
    const olusturulanTrElementi = document.createElement('tr');
    olusturulanTrElementi.innerHTML = ` <td>${eklenecekKisi.ad}</td>
    <td>${eklenecekKisi.soyad}</td>
    <td>${eklenecekKisi.mail}</td>
    <td>                
         <button class="btn btn--edit"><i class="far fa-edit"></i></button>
         <button class="btn btn--delete"><i class="fa-solid fa-trash"></i></button>
                         
    </td>`;

    kisiListesi.appendChild(olusturulanTrElementi);
    tumKisilerDizisi.push(eklenecekKisi);

    bilgiOlustur('Kisi Rehbere Kaydedildi', true)

}



