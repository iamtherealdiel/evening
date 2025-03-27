/*
  # Storage access policies for images bucket

  1. Security
    - Enable public access to images bucket
    - Allow authenticated users to upload images
    - Allow public read access to all images

  2. Policies
    - select: Allow public read access
    - insert: Allow authenticated users to upload
*/

-- Create storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Policy for public read access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- Policy for authenticated uploads
create policy "Authenticated Users Can Upload"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'images' );