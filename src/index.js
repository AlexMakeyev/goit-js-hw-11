import './sass/main.scss';
import Notiflix from 'notiflix';
import markUp from './js/photoTpl';
import makeSearch from './js/search.js';
import { config } from './js/config';
import "notiflix/dist/notiflix-3.2.5.min.css";
import getRefs from './js/getRefs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = getRefs();
refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.classList.add('disabled');
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSearchFormSubmit(event) {
    event.preventDefault();
    if (!inputFieldValidation(event)) {
        return;
    } ;      
    makeSearch( config).then(data => {        
        if (data.totalHits === 0) {
            config.search = '';
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        };       
        config.page += 1;
        refs.loadMoreBtn.classList.remove('disabled');
        config.totalHits += config.perPage;
        event.target.reset();
        makeMarkUp(data);             
    })
        .catch(error => errorHandling());    
};
function onLoadMoreBtnClick() {
    
    makeSearch( config).then(data => {
        config.totalHits += config.perPage;
        
        makeMarkUp(data);
        if (config.totalHits >= data.totalHits) {
            refs.loadMoreBtn.classList.add('disabled');
            config.search = '';
            return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        };
        
    })
        .catch(error => errorHandling());
    config.page += 1;


};

function makeMarkUp(data) {
    const searchElement = data.hits.map(markUp).join('');
    refs.gallery.insertAdjacentHTML('beforeend', searchElement);  
};
function clearMarkUp() {
    refs.gallery.innerHTML = ' ';
};
function inputFieldValidation(event) {
    if (event.currentTarget.elements.searchQuery.value.trim() === '') {
        clearMarkUp();
        refs.loadMoreBtn.classList.add('disabled');
        Notiflix.Notify.failure("Enter somethig, please");
        return false;
    };    
    if (event.currentTarget.elements.searchQuery.value.trim() !== config.search) {
                
        config.search = event.currentTarget.elements.searchQuery.value;
        config.page = 1;
        refs.loadMoreBtn.classList.add('disabled');
        config.totalHits = 0;
        clearMarkUp();
        return true;
    };    
};
function errorHandling() {
    clearMarkUp();
            config.search = '';
            refs.loadMoreBtn.classList.add('disabled');
        return Notiflix.Notify.failure("OOps, something went wrong"); 
};

