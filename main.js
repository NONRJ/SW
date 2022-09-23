window.addEventListener('load', function introAllPersons() {
		let showCard = document.querySelector('.show__card');
		let showName = document.querySelectorAll('.show__desc');
		let nextBtn = document.querySelector('.show__btn-card-right');
		let prevBtn = document.querySelector('.show__btn-card-left');
		let showBtnRight = document.querySelector('.show__btn-right');
		let showBtnLeft = document.querySelector('.show__btn-left');
		let countElem = document.querySelector('.count__elem');
		let sectionShow = document.querySelector('.show');
	
		let modal = document.querySelector('.modal');
		let infoName = document.querySelector('.modal__name');
		let infoBday = document.querySelector('.modal__info-bday');
		let infoGender = document.querySelector('.modal__info-gender');
		let infoPlanet = document.querySelector('.modal__info-planet');
		let infoFilms = document.querySelector('.modal__info-films');
		let infoSpecies = document.querySelector('.modal__info-species');
		let modalBtn = document.querySelector('.modal__btn');
		

		let count = 1;
		let parentTarget;
		countElem.textContent = count;

		nextBtn.addEventListener('click', showNextPage);
		prevBtn.addEventListener('click', showPrevPage);
		sectionShow.addEventListener('click', showInfo);
		modalBtn.addEventListener('click', closeModal);
	
		let getHeroes = async (link) => {

			let promiseHeroes = await fetch(link);
			let heroes = await promiseHeroes.json();
			let listHeroes = heroes.results;
	
			(heroes.next === null ) ? 
			(nextBtn.removeEventListener('click', showNextPage), showBtnRight.classList.add('disable')) :
			(showBtnRight.classList.remove('disable'), nextBtn.addEventListener('click', showNextPage));
			
			(heroes.previous === null) ? 
			(prevBtn.removeEventListener('click', showPrevPage), showBtnLeft.classList.add('disable')) :
			(showBtnLeft.classList.remove('disable'),prevBtn.addEventListener('click', showPrevPage));
	
			for (let i = 0; i < showName.length; i++) {
				showName[i].textContent = await '';
			}
	
			for (let i = 0; i < showName.length && i < listHeroes.length; i++) {
				showName[i].textContent = await listHeroes[i].name
			}
		}
	
		function showNextPage() {
			count++;
			getHeroes(`https://swapi.dev/api/people/?page=${count}`)
			countElem.textContent = count;	
		}
	
		function showPrevPage() {
			count--;
			getHeroes(`https://swapi.dev/api/people/?page=${count}`);
			countElem.textContent = count;
		}
	
		function closeModal() {
			
			modal.style = '';
		}
	
		async function showInfo(event) {
			
			if(event.target.closest('.show__desc') ) {
				
				let currentHeroes = await fetch(`https://swapi.dev/api/people/?page=${count}`);
				let jsonCurentHeroes = await currentHeroes.json();
				let resulteHeroes = await jsonCurentHeroes.results;
				parentTarget = event.target;
				let films = [];
				let planet;
				let species;

				(parentTarget === event.target.closest('.show__card')) ? target = parentTarget.firstElementChild.textContent :
				target = parentTarget.textContent;
				

				await resulteHeroes.forEach(hero => {
					
					if(hero.name === target) {
						films = hero.films;
						planet = hero.homeworld;
						species = hero.species;
						infoName.textContent = hero.name;
						infoBday.textContent = hero.birth_year;
						infoGender.textContent = hero.gender;
					}
				});

				
				(async function() {
					films.forEach( async (film) => {
						for(let i = 0; i < infoFilms.children.length; i++) {
							infoFilms.children[i].remove();
						} 
						let getFilm = await fetch(`${film}`)
							.then(data => data.json())
							.then(data => {
								infoFilms.insertAdjacentHTML('beforeend', `<li>${data.title}</li>`); 
							})
					});
				})().then(data => modal.style.cssText = `transform: translate(-50%, 50%);`);
					
				let getPlanet = await fetch(`${planet}`)
					.then(data => data.json())
					.then(data => infoPlanet.textContent = data.name);
	
					infoSpecies.textContent = 'unknown';
	
				await species.forEach(item => {
					let getSpacies = fetch(`${item}`)
						.then(data => data.json())
						.then(data => infoSpecies.textContent = data.name);
				});
			} 
		} 
		getHeroes("https://swapi.dev/api/people/");
	}
);

