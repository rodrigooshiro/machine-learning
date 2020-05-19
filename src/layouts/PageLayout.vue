<template>
  <div>
    <page-header ref="header" :name="name" />
    <slot />
  </div>
</template>

<script>
import PageHeader from './PageHeader'

export default {
  name: 'PageLayout',
  props: ['name'],
  components: {
    PageHeader
  }
}
</script>

<style>
.router-link:hover,
.router-link:focus {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
}
.router-link {
  color: rgba(255, 255, 255, 0.5);
}
.nav-link:focus {
  outline: none !important;
}
.form-toolbar-rtl {
  direction: rtl;
  float: right;
}
.form-float-right {
  float: right;
}
.form-toolbar-rtl .btn,
.form-toolbar-rtl .badge {
  margin-left: 4px;
}
.form-toolbar-ltr {
  direction: ltr;
  float: left;
}
.form-float-left {
  float: left;
}
.form-toolbar-ltr .btn,
.form-toolbar-ltr .badge {
  margin-right: 4px;
}
.form-toolbar-rtl .b-icon,
.form-toolbar-ltr .b-icon {
  width: 16px;
  height: 16px;
}
.b-icon-sup {
  height: 28px;
  margin-right: 4px;
}
.b-icon-sup svg {
  cursor: pointer;
}
.btn:disabled {
  cursor: not-allowed;
}
.btn-badge,
.btn-group-badge > .btn {
  padding: 4px 4px !important;
  line-height: 0 !important;
  margin-bottom: 0.1rem;
}
.indexInput {
  padding-right: 10px;
  width: 220px;
}
.indexInput select {
  width: 210px !important;
}
.indexInput label {
  justify-content: flex-start;
  padding-left: 10px;
}
</style>

