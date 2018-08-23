use sakila;

-- 1a
select * from actor;

-- 1b
select first_name, last_name from actor;
select upper(concat(first_name, ' ', last_name)) as actor_name from actor;

-- 2a
select actor_id, first_name, last_name from actor
where first_name = 'JOE';

-- 2b
select actor_id, first_name, last_name from actor
where last_name like '%GEN%';

-- 2c
select last_name, first_name from actor
where last_name like '%LI%'
order by last_name, first_name;

-- 2d
select country_id, country from country
where country in ('Afghanistan', 'Bangladesh', 'China');

-- 3a
alter table actor
add column middle_name VARCHAR(30)
after first_name;

-- 3b
alter table actor
modify column middle_name binary(30);

-- 3c
alter table actor
drop middle_name;

-- 4a
select last_name, count(last_name) from actor
group by last_name;

-- 4b
select last_name, count(last_name) from actor
group by last_name
having count(last_name) > 1;

-- 4c
update actor
set first_name = 'HARPO'
where first_name = 'GROUCHO' and last_name = 'WILLIAMS';

-- 4d
update actor
set first_name = CASE
	when first_name = 'HARPO' then 'GROUCHO'
    else 'MUCHO GROUCHO' end
where actor_id = 172;

-- 5a
describe sakila.address;

-- 6a
select s.first_name, s.last_name, a.address
from staff s left join address a on s.address_id = a.address_id;

-- 6b
select s.first_name, s.last_name, sum(p.amount) as 'total_payment'
from staff s left join payment p on s.staff_id = p.staff_id
group by s.first_name, s.last_name;

-- 6c
select f.title, count(fa.actor_id) as 'num_actors_in_movie'
from film f left join film_actor  fa on f.film_id = fa.film_id
group by f.title;

-- 6d
select f.title, count(fa.actor_id) as 'num_actors_in_movie'
from film f left join film_actor  fa on f.film_id = fa.film_id
group by f.title
having f.title = 'Hunchback Impossible';

-- 6e
select c.first_name, c.last_name, sum(p.amount) as 'total_payment'
from customer c left join payment p on c.customer_id = p.customer_id
group by c.first_name, c.last_name;

-- 7a
select title from film
where
(title like 'K%' or title like 'Q%')
and
language_id = (select language_id from language where name='English');

-- 7b
select first_name, last_name from actor
where actor_id
in(
	select actor_id from film_actor
    where film_id 
	in(
		select film_id from film
        where title='ALONE TRIP'));
        
-- 7c
select customer.last_name, customer.first_name, customer.email from customer
join customer_list on customer.customer_id = customer_list.ID
where customer_list.country = 'Canada';

-- 7d
select title from film
where film_id in(
	select film_id from film_category
    where category_id in(
		select category_id from category
        where name = 'Family'));
        
-- 7e
select title, count(f.film_id) as 'num_movies_rented' from  film f
join inventory i on (f.film_id = i.film_id)
join rental r on (i.inventory_id = r.inventory_id)
group by title order by num_movies_rented desc;

-- 7f
select s.store_id, sum(amount) as revenue from store s
inner join staff on s.store_id = staff.store_id
inner join payment p on p.staff_id = staff.staff_id
group by s.store_id;

-- 7g
select s.store_id, city.city, country.country from store s
inner join address on s.address_id = address.address_id
inner join city on address.city_id = city.city_id
inner join country on city.country_id = country.country_id;

-- 7h
select name, sum(p.amount) as gross_revenue from category c
join film_category fc on fc.category_id = c.category_id
inner join inventory i on i.film_id = fc.film_id
inner join rental r on r.inventory_id = i.inventory_id
right join payment p on p.rental_id = r.rental_id
group by name order by gross_revenue desc limit 5;

-- 8a
drop view if exists top_grossing_genres;
create view top_grossing_genres as
select name, sum(p.amount) as gross_revenue from category c
join film_category fc on fc.category_id = c.category_id
inner join inventory i on i.film_id = fc.film_id
inner join rental r on r.inventory_id = i.inventory_id
right join payment p on p.rental_id = r.rental_id
group by name order by gross_revenue desc limit 5;

-- 8b
select * from top_grossing_genres;

-- 8c
drop view top_grossing_genres;





