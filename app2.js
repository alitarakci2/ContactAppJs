

class Kisi{
constructor(ad,soyad,mail){
    this.ad = ad;
    this.soyad = soyad;
    this.mail = mail;
}

}

class Util{
    static bosAlanKontrolEt(...alanlar){
        let sonuc = true;
        alanlar.forEach(alan=> {
            if(alan.length === 0){
                sonuc = false;
                return false;
            }
        });

        return sonuc;

    }
    static emailgecerliMi(email){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
          return (true)
        }       
          return (false)
        

    }
}

class Ekran{

    constructor(){
        this.ad = document.getElementById('ad');
        this.soyad = document.getElementById('soyad');
        this.mail = document.getElementById('mail');
        this.ekleGuncelleButon = document.querySelector('.kaydetGuncelle');
        this.form = document.getElementById('form-rehber');
        this.form.addEventListener('submit', this.kaydetGuncelle.bind(this));
        this.kisiListesi = document.querySelector('.kisi-listesi');

        this.kisiListesi.addEventListener('click', this.guncelleVeyaSil.bind(this));
        this.depo = new Depo();
        this.secilenSatir = undefined;
        this.kisileriEkranaYazdir();
        


    }

    alanlariTemizle(){
        this.ad.value = '';
        this.soyad.value = '';
        this.mail.value = '';
    }
    guncelleVeyaSil(e){
        const tiklanmaYeri = e.target;
        if(tiklanmaYeri.classList.contains('btn--delete')){
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            this.kisiyiEkrandanSil();

        }else if(tiklanmaYeri.classList.contains('btn--edit')){
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            this.ekleGuncelleButon.value = 'Guncelle';
            this.ad.value = this.secilenSatir.cells[0].textContent;
            this.soyad.value = this.secilenSatir.cells[1].textContent;
            this.mail.value = this.secilenSatir.cells[2].textContent;
           


        }

    }

    kisiyiEkrandaGuncelle(kisi){

        const sonuc = this.depo.kisiGuncelle(kisi, this.secilenSatir.cells[2].textContent);
        if(sonuc){
            this.secilenSatir.cells[0].textContent = kisi.ad;
            this.secilenSatir.cells[1].textContent = kisi.soyad;
            this.secilenSatir.cells[2].textContent = kisi.mail;
            this.alanlariTemizle();
            this.secilenSatir = undefined;
            this.ekleGuncelleButon.value = 'kaydet';
            this.bilgiOlustur('Kisi guncellendi', true);
        }else{

            this.bilgiOlustur('Yazdiginiz mail kullanimda', false);
        }






    }

    kisiyiEkrandanSil(){

        this.secilenSatir.remove();
        const silinecekMail = this.secilenSatir.cells[2].textContent;
        this.depo.kisiSil(silinecekMail);
        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.bilgiOlustur('Kisi Rehberden Silindi', true);
    }

    kisileriEkranaYazdir(){
        this.depo.tumKisiler.forEach(kisi=>{
            this.kisiyiEkranaEkle(kisi);
        });
    }

    kisiyiEkranaEkle(kisi){
        const olusturulanTr = document.createElement('tr');
        olusturulanTr.innerHTML = `<td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.mail}</td>
        <td>                
             <button class="btn btn--edit"><i class="far fa-edit"></i></button>
             <button class="btn btn--delete"><i class="fa-solid fa-trash"></i></button>
                             
        </td>`;

        this.kisiListesi.appendChild(olusturulanTr);

    }

    bilgiOlustur(mesaj, durum){

        const uyariDivi = document.querySelector('.bilgi');
        uyariDivi.innerHTML =mesaj;
        uyariDivi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');


        setTimeout(function (){
            uyariDivi.className = 'bilgi';
            
        }, 2000);

    

    }
    kaydetGuncelle(e){
        e.preventDefault();
        const kisi = new Kisi(this.ad.value, this.soyad.value, this.mail.value);
        const sonuc = Util.bosAlanKontrolEt(kisi.ad, kisi.soyad, kisi.mail)
        const emailgecerliMi = Util.emailgecerliMi(this.mail.value);
        if(sonuc){
            if(!emailgecerliMi){
                this.bilgiOlustur('Gecerli bir mail yaziniz', false);
                return;
            }
            if(this.secilenSatir){

            this.kisiyiEkrandaGuncelle(kisi);


            }else{

            const sonuc = this.depo.kisiEkle(kisi);
            console.log("sonuc : " + sonuc + "kaydet guncelle icinde")
            if(sonuc){
                this.bilgiOlustur('Basariyla eklendi', true);
                this.kisiyiEkranaEkle(kisi);
                this.alanlariTemizle();

            }
            this.bilgiOlustur('Bu mail kullanimda', false);




            }

            
            this.alanlariTemizle();

        }else{
            this.bilgiOlustur('Bos alanlari doldurunuz', false);


        }

        
    }
}

class Depo{

    constructor(){
        this.tumKisiler = this.kisileriGetir();
    }

    emailEssizMi(mail){
       const sonuc = this.tumKisiler.find(kisi=>{
            return kisi.mail === mail
        });
        if(sonuc){

            console.log(mail + "kullaniumda");
            return false;
        }else{
            console.log(mail + "kullanimda degil");

            return true;
        }

    }

     kisileriGetir(){
        let tumKisilerLocal;
        if(localStorage.getItem('tumKisiler') === null){
            tumKisilerLocal = [];
        }else {
            tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'));
        }
        return tumKisilerLocal;
    }
    kisiEkle(kisi){     
        if(this.emailEssizMi(kisi.mail)){

            this.tumKisiler.push(kisi);
            localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
            return true;
        }else{

            return false;

        }
    
    }
    kisiSil(mail){
        this.tumKisiler.forEach((kisi,index)=>{
            if(kisi.mail === mail){
                this.tumKisiler.splice(index,1);
            }
        });
        localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
    }

    kisiGuncelle(guncellenmisKisi,mail){
        let tumKisilerLocal;
        if(guncellenmisKisi.mail === mail){
            this.tumKisiler.forEach((kisi,index)=>{
                if(kisi.mail === mail){
                    this.tumKisiler[index] = guncellenmisKisi;
                    tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'));
                    return true;
                }
            });
    
            return true;

        }

        if(this.emailEssizMi(guncellenmisKisi.mail)){
            console.log(guncellenmisKisi.mail + "icin kontrol yapiliyor sonuc : guncelleme yapabilirsin");
         
        this.tumKisiler.forEach((kisi,index)=>{
            if(kisi.mail === mail){
                this.tumKisiler[index] = guncellenmisKisi;
                tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'));
                return true;
            }
        });

        return true;
       
        }else{
            
            console.log(guncellenmisKisi.mail + " mail kullanimda guncelleme yapilamaz");
            return false;
        }
        
    }
}


document.addEventListener('DOMContentLoaded', function(e){
    const ekran = new Ekran();
})