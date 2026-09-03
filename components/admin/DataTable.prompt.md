Compact admin table.

```jsx
<DataTable onRowClick={open} rows={orders} columns={[
  {key:"number",label:"Order"},{key:"total",label:"Total",numeric:true,align:"end"},
  {key:"status",label:"Status",render:(r)=><StatusPill status={r.status}/>}]} />
```
